        async function loadData() {
            const requestId = ++latestLoadRequestId;
            const stock = normalizeTickerInput(document.getElementById('stock').value);
            const monthlyAmount = parseMonthlyAmount();
            updateQuickAmountButtons();

            if (!stock || monthlyAmount <= 0) {
                showStatus('Bitte gültige Werte eingeben.', 'error');
                return;
            }

            zoomEnabled = currentPeriod >= 5;
            updateZoomControls();

            // Only reload external data if ticker changed
            if (currentLoadedStock === stock && rawStockData) {
                recalculatePortfolioFromRawData();
                showStatus(`Lokale Neuberechnung für ${stock} abgeschlossen.`, 'success');
                return;
            }

            setLoadingState(true);
            clearStatus();
            lastRequestedTicker = stock;

            try {
                const cached = loadStockDataFromCache(stock);

                if (cached && isCacheFresh(cached)) {
                    rawStockData = {
                        values: cached.values,
                        dividends: cached.dividends
                    };
                    currentLoadedStock = stock;
                    portfolioData = buildPortfolioFromMonthlyData(
                        stock,
                        monthlyAmount,
                        currentPeriod,
                        rawStockData.values,
                        buildDividendMap(rawStockData.dividends)
                    );

                    if (requestId !== latestLoadRequestId) return;
                    const totalInvested = portfolioData.investedAmounts[portfolioData.investedAmounts.length - 1] || 0;
                    const totalCurrent = portfolioData.portfolioValues[portfolioData.portfolioValues.length - 1] || 0;
                    const totalMultiple = totalInvested > 0 ? (totalCurrent / totalInvested).toFixed(2) : '0.00';
                    currentRealityCheckMessage = totalInvested > 0
                        ? getRandomRealityCheck(totalInvested, totalCurrent, totalMultiple)
                        : 'Zoome oder lade Daten, dann gibt es hier den kleinen finanziellen Realitätscheck für genau diesen Abschnitt.';
                    updateChart();
                    showStatus(`Daten aus dem Cache geladen: ${stock}`, 'success');
                } else {
                    showStatus(`Lade neue Marktdaten für ${stock}...`, 'success');

                    const [values, dividends] = await Promise.all([
                        fetchTwelveDataMonthly(stock, 40),
                        fetchAlphaVantageDividends(stock)
                    ]);

                    if (requestId !== latestLoadRequestId) return;

                    rawStockData = { values, dividends };
                    currentLoadedStock = stock;
                    saveStockDataToCache(stock, values, dividends);

                    portfolioData = buildPortfolioFromMonthlyData(
                        stock,
                        monthlyAmount,
                        currentPeriod,
                        values,
                        buildDividendMap(dividends)
                    );
                    const totalInvested = portfolioData.investedAmounts[portfolioData.investedAmounts.length - 1] || 0;
                    const totalCurrent = portfolioData.portfolioValues[portfolioData.portfolioValues.length - 1] || 0;
                    const totalMultiple = totalInvested > 0 ? (totalCurrent / totalInvested).toFixed(2) : '0.00';
                    currentRealityCheckMessage = totalInvested > 0
                        ? getRandomRealityCheck(totalInvested, totalCurrent, totalMultiple)
                        : 'Zoome oder lade Daten, dann gibt es hier den kleinen finanziellen Realitätscheck für genau diesen Abschnitt.';
                    updateChart();
                    showStatus(`Neue Daten erfolgreich geladen: ${stock}`, 'success');
                }
            } catch (error) {
                showStatus('Fehler beim Laden: ' + error.message, 'error');
            } finally {
                if (requestId === latestLoadRequestId) {
                    setLoadingState(false);
                }
            }
        }

        window.addEventListener('load', () => {
            loadDatasetVisibility();
            syncDatasetCheckboxes();
            zoomEnabled = currentPeriod >= 5;
            updatePeriodDisplay();
            syncPeriodDropdownSelection();
            updateZoomControls();
            loadData();
            updateQuickAmountButtons();

            document.getElementById('monthlyAmount').addEventListener('change', () => {
                if (rawStockData && currentLoadedStock) {
                    recalculatePortfolioFromRawData();
                }
            });

            document.getElementById('stock').addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    loadData();
                }
            });

            const canvas = document.getElementById('portfolioChart');

            canvas.addEventListener('mousemove', (e) => {
                lastPointerPosition = { x: e.clientX, y: e.clientY };
                updateLiveDragSelectionPopup(e.clientX, e.clientY);
            });
            canvas.addEventListener('mouseup', () => {
                isDragSelecting = false;
                dragSelectionStartIndex = null;
                hideSelectionPopup();
            });

            canvas.addEventListener('mouseleave', () => {
                if (isDragSelecting) {
                    hideSelectionPopup();
                }
            });

            canvas.addEventListener('wheel', (e) => {
                if (!zoomEnabled || !chart) return;

                if (!e.shiftKey) {
                    e.preventDefault();
                    chart.pan({ x: e.deltaY * 1.2 }, undefined, 'default');
                    hideSelectionPopup();
                    updateVisibleStats();
                }
            }, { passive: false });

            canvas.addEventListener('touchstart', (e) => {
                if (!zoomEnabled || !chart) return;

                if (e.touches.length === 2) {
                    lastTouchX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                    isDragSelecting = false;
                    dragSelectionStartIndex = null;
                }
            }, { passive: true });

            canvas.addEventListener('touchmove', (e) => {
                if (!zoomEnabled || !chart) return;

                if (e.touches.length === 2) {
                    const currentTouchX = (e.touches[0].clientX + e.touches[1].clientX) / 2;

                    if (lastTouchX !== null) {
                        const deltaX = currentTouchX - lastTouchX;
                        if (Math.abs(deltaX) > 1) {
                            chart.pan({ x: deltaX * -1 }, undefined, 'default');
                            hideSelectionPopup();
                            updateVisibleStats();
                        }
                    }

                    lastTouchX = currentTouchX;
                }
            }, { passive: true });

            canvas.addEventListener('touchend', () => {
                lastTouchX = null;
            }, { passive: true });

            canvas.addEventListener('touchcancel', () => {
                lastTouchX = null;
            }, { passive: true });
            window.addEventListener('mouseup', () => {
                isDragSelecting = false;
                dragSelectionStartIndex = null;
                hideSelectionPopup();
            });
            window.addEventListener('resize', () => {
                hideSelectionPopup();
            });
        });
