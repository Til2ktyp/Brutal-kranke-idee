async function loadData() {
    const requestId = ++latestLoadRequestId;
    const stock = normalizeTickerInput(document.getElementById('stock').value);
    const monthlyAmount = parseMonthlyAmount();
    updateQuickAmountButtons();

    if (monthlyAmount <= 0) {
        showStatus('Bitte einen gültigen monatlichen Betrag eingeben.', 'error');
        return;
    }

    zoomEnabled = currentPeriod >= 5;
    updateZoomControls();

    setLoadingState(true);
    clearStatus();

    try {
        if (isPortfolioMode) {
            if (portfolioAssets.length === 0) {
                showStatus('Bitte füge mindestens ein Asset im Portfolio-Drawer hinzu.', 'error');
                setLoadingState(false);
                return;
            }

            showStatus(`Lade Daten für ${portfolioAssets.length} Portfolio-Assets...`, 'success');

            // Lade alle Assets parallel
            await Promise.all(portfolioAssets.map(async (asset) => {
                const symbol = asset.symbol;
                const cached = loadStockDataFromCache(symbol);

                if (cached && isCacheFresh(cached)) {
                    rawPortfolioStockData[symbol] = {
                        values: cached.values,
                        dividends: cached.dividends
                    };
                } else {
                    const [values, dividends] = await Promise.all([
                        fetchMonthlyValues(symbol, 40),
                        fetchAlphaVantageDividends(symbol)
                    ]);
                    rawPortfolioStockData[symbol] = { values, dividends };
                    saveStockDataToCache(symbol, values, dividends);
                }
            }));

            if (requestId !== latestLoadRequestId) return;

            portfolioData = buildAggregatedPortfolio(
                portfolioAssets,
                monthlyAmount,
                currentPeriod,
                rawPortfolioStockData
            );

            currentLoadedStock = 'Portfolio';

            const totalInvested = portfolioData.investedAmounts[portfolioData.investedAmounts.length - 1] || 0;
            const totalCurrent = portfolioData.portfolioValues[portfolioData.portfolioValues.length - 1] || 0;
            const totalMultiple = totalInvested > 0 ? (totalCurrent / totalInvested).toFixed(2) : '0.00';
            currentRealityCheckMessage = totalInvested > 0
                ? getRandomRealityCheck(totalInvested, totalCurrent, totalMultiple)
                : 'Reality Check bereit.';
            
            updateChart();
            showStatus(`Portfolio-Simulation erfolgreich geladen.`, 'success');
        } else {
            // Einzel-Asset-Modus
            if (!stock) {
                showStatus('Bitte eine gültige Aktie eingeben.', 'error');
                setLoadingState(false);
                return;
            }

            // Falls bereits geladen, lokal berechnen
            if (currentLoadedStock === stock && rawStockData) {
                recalculatePortfolioFromRawData();
                showStatus(`Lokale Neuberechnung für ${stock} abgeschlossen.`, 'success');
                setLoadingState(false);
                return;
            }

            lastRequestedTicker = stock;
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
                    : 'Reality Check bereit.';
                updateChart();
                showStatus(`Daten aus dem Cache geladen: ${stock}`, 'success');
            } else {
                showStatus(`Lade neue Marktdaten für ${stock}...`, 'success');

                const [values, dividends] = await Promise.all([
                    fetchMonthlyValues(stock, 40),
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
                    : 'Reality Check bereit.';
                updateChart();
                showStatus(`Neue Daten erfolgreich geladen: ${stock}`, 'success');
            }
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
            applyPerformanceMode();
            zoomEnabled = currentPeriod >= 5;
            updatePeriodDisplay();
            syncPeriodDropdownSelection();
            updateZoomControls();
            updateDividendModeControls();
            syncSettingsControls();
            refreshCacheSummary();
            
            // Portfolio Initialisierung
            if (typeof syncPortfolioDrawerUI === 'function') {
                syncPortfolioDrawerUI();
            }

            loadData();
            updateQuickAmountButtons();

            document.getElementById('monthlyAmount').addEventListener('change', () => {
                if (isPortfolioMode || (rawStockData && currentLoadedStock)) {
                    recalculatePortfolioFromRawData();
                }
            });

            document.getElementById('stock').addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    loadData();
                }
            });

            const canvas = document.getElementById('portfolioChart');

            canvas.addEventListener('click', () => {
                // Ein einfacher Klick blendet das Auswertungs-Popup aus
                hideSelectionPopup();
            });

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
                    scheduleVisibleStatsUpdate();
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
                            scheduleVisibleStatsUpdate();
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
            let _resizeDebounceId = null;
            window.addEventListener('resize', () => {
                hideSelectionPopup();
                if (_resizeDebounceId !== null) clearTimeout(_resizeDebounceId);
                _resizeDebounceId = setTimeout(() => {
                    _resizeDebounceId = null;
                    _lastStatsRange = { start: -1, end: -1 };
                    updateVisibleStats();
                }, 150);
            });
        });
