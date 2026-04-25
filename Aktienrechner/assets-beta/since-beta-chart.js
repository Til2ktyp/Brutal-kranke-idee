        function getIndexFromCanvasX(chartInstance, clientX) {
            if (!chartInstance || !chartInstance.scales || !chartInstance.scales.x) return null;

            const rect = chartInstance.canvas.getBoundingClientRect();
            const canvasX = clientX - rect.left;
            const xValue = chartInstance.scales.x.getValueForPixel(canvasX);

            if (!Number.isFinite(xValue)) return null;
            return Math.max(0, Math.min(portfolioData.months.length - 1, Math.round(xValue)));
        }

        function updateLiveDragSelectionPopup(clientX, clientY) {
            if (!isDragSelecting || dragSelectionStartIndex === null || !chart || !portfolioData) return;

            const currentIndex = getIndexFromCanvasX(chart, clientX);
            if (currentIndex === null) return;

            const startIndex = Math.min(dragSelectionStartIndex, currentIndex);
            const endIndex = Math.max(dragSelectionStartIndex, currentIndex);

            lastPointerPosition = { x: clientX, y: clientY };
            updateSelectionPopupForRange(startIndex, endIndex);
        }
        function getLatestPrice() {
            if (!portfolioData || !Array.isArray(portfolioData.prices) || portfolioData.prices.length === 0) {
                return 0;
            }
            return portfolioData.prices[portfolioData.prices.length - 1] || 0;
        }

        function simulateSelectedRange(startIndex, endIndex) {
            if (!portfolioData || !rawStockData || !currentLoadedStock) return null;

            const months = portfolioData.months;
            const prices = portfolioData.prices;
            const safeStart = Math.max(0, startIndex);
            const safeEnd = Math.min(endIndex, months.length - 1);

            if (safeEnd < safeStart) return null;

            const selectedMonths = months.slice(safeStart, safeEnd + 1);
            const selectedPrices = prices.slice(safeStart, safeEnd + 1);
            const monthlyAmount = parseMonthlyAmount();
            if (!monthlyAmount || monthlyAmount <= 0 || selectedMonths.length === 0) return null;

            const dividendMap = buildDividendMap(rawStockData.dividends);
            let shares = 0;
            let cumulativeDividend = 0;

            selectedMonths.forEach((date, index) => {
                const price = selectedPrices[index];
                const dividendPerShare = dividendMap.get(String(date).slice(0, 7)) || 0;

                if (!Number.isFinite(price) || price <= 0) return;

                let dividendCash = 0;
                if (dividendPerShare > 0) {
                    dividendCash = shares * dividendPerShare;
                    shares += dividendCash / price;
                    cumulativeDividend += dividendCash;
                }

                shares += monthlyAmount / price;
            });

            const invested = monthlyAmount * selectedMonths.length;
            const finalPrice = selectedPrices[selectedPrices.length - 1] || 0;
            const portfolioValue = shares * finalPrice;
            const gainLoss = portfolioValue - invested;
            const returnPercent = invested > 0 ? (gainLoss / invested * 100) : 0;

            return {
                startDate: selectedMonths[0],
                endDate: selectedMonths[selectedMonths.length - 1],
                invested,
                portfolioValue,
                gainLoss,
                dividends: cumulativeDividend,
                returnPercent
            };
        }

        function updateSelectionPopupForRange(startIndex, endIndex) {
            const result = simulateSelectedRange(startIndex, endIndex);
            if (!result) {
                hideSelectionPopup();
                return;
            }

            const html = `
                <div class="selection-popup-row"><span class="selection-popup-label">Zeitraum</span><span class="selection-popup-value">${result.startDate} → ${result.endDate}</span></div>
                <div class="selection-popup-row"><span class="selection-popup-label">Eingezahlt</span><span class="selection-popup-value">${formatCurrency(result.invested)}</span></div>
                <div class="selection-popup-row"><span class="selection-popup-label">Portfolio</span><span class="selection-popup-value">${formatCurrency(result.portfolioValue)}</span></div>
                <div class="selection-popup-row"><span class="selection-popup-label">Gewinn / Verlust</span><span class="selection-popup-value">${result.gainLoss >= 0 ? '+' : '-'} ${formatCurrency(Math.abs(result.gainLoss)).replace('€ ', '€ ')}</span></div>
                <div class="selection-popup-row"><span class="selection-popup-label">Dividenden</span><span class="selection-popup-value">${formatCurrency(result.dividends)}</span></div>
                <div class="selection-popup-row"><span class="selection-popup-label">Rendite</span><span class="selection-popup-value">${result.returnPercent >= 0 ? '+' : ''}${result.returnPercent.toFixed(2)}%</span></div>
            `;

            showSelectionPopupAt(lastPointerPosition.x, lastPointerPosition.y, html);
        }

                function applyStatsFromRange(startIndex, endIndex) {
            if (!portfolioData) return;

            const portfolioValues = portfolioData.portfolioValues;
            const investedAmounts = portfolioData.investedAmounts;
            const cumulativeDividends = portfolioData.cumulativeDividends;

            const safeStart = Math.max(0, startIndex);
            const safeEnd = Math.min(endIndex, portfolioValues.length - 1);

            const previousPortfolio = safeStart > 0 ? portfolioValues[safeStart - 1] : 0;
            const previousInvested = safeStart > 0 ? investedAmounts[safeStart - 1] : 0;
            const previousDividends = safeStart > 0 ? cumulativeDividends[safeStart - 1] : 0;

            const currentPortfolio = portfolioValues[safeEnd] || 0;
            const currentInvestedTotal = investedAmounts[safeEnd] || 0;
            const currentDividendsTotal = cumulativeDividends[safeEnd] || 0;

            const investedInRange = currentInvestedTotal - previousInvested;
            const dividendsInRange = currentDividendsTotal - previousDividends;
            const gainLoss = currentPortfolio - previousPortfolio - investedInRange;
            const baseCapital = previousPortfolio + investedInRange;
            const returnPercent = baseCapital > 0 ? (gainLoss / baseCapital * 100).toFixed(2) : 0;

            const rangeStart = portfolioData.months[safeStart] || '–';
            const rangeEnd = portfolioData.months[safeEnd] || '–';
            const latestPrice = portfolioData.prices[safeEnd] || getLatestPrice();
            const opportunityMultiple = investedInRange > 0 ? currentPortfolio / investedInRange : 0;
            const realityCheckText = document.getElementById('realityCheckText');

            document.getElementById('activeTickerInfo').innerText = currentLoadedStock || '–';
            document.getElementById('visibleRangeInfo').innerText = `${rangeStart} → ${rangeEnd}`;
            document.getElementById('latestPriceInfo').innerText = formatCurrency(latestPrice);

            if (realityCheckText) {
                realityCheckText.innerText = investedInRange > 0
                    ? currentRealityCheckMessage
                    : 'Zoome oder lade Daten, dann gibt es hier den kleinen finanziellen Realitätscheck für genau diesen Abschnitt.';
            }

            document.getElementById('portfolioValue').innerText = '€ ' + currentPortfolio.toLocaleString('de-DE', { maximumFractionDigits: 2 });
            document.getElementById('investedAmount').innerText = '€ ' + investedInRange.toLocaleString('de-DE', { maximumFractionDigits: 2 });
            document.getElementById('gainLoss').innerText = (gainLoss >= 0 ? '+ €' : '- €') + Math.abs(gainLoss).toLocaleString('de-DE', { maximumFractionDigits: 2 });
            document.getElementById('dividendText').innerText = '+ € ' + dividendsInRange.toLocaleString('de-DE', { maximumFractionDigits: 2 }) + ' Dividenden';
            document.getElementById('returnPercent').innerText = (returnPercent >= 0 ? '+' : '') + returnPercent + '%';

            const gainLossElement = document.getElementById('gainLoss');
            gainLossElement.style.color = gainLoss >= 0 ? '#2ecc71' : '#e74c3c';
        }

        function updateVisiblePriceAxis(startIndex, endIndex) {
            if (!chart || !portfolioData || !Array.isArray(portfolioData.prices)) return;
            if (!chart.options || !chart.options.scales || !chart.options.scales.yPrice) return;

            const safeStart = Math.max(0, Math.floor(startIndex));
            const safeEnd = Math.min(portfolioData.prices.length - 1, Math.ceil(endIndex));
            const visiblePrices = portfolioData.prices
                .slice(safeStart, safeEnd + 1)
                .filter(price => Number.isFinite(price));

            if (visiblePrices.length === 0) return;

            const minPrice = Math.min(...visiblePrices);
            const maxPrice = Math.max(...visiblePrices);
            const range = maxPrice - minPrice;
            const padding = range > 0 ? range * 0.14 : Math.max(maxPrice * 0.08, 1);

            chart.options.scales.yPrice.min = Math.max(0, minPrice - padding);
            chart.options.scales.yPrice.max = maxPrice + padding;
        }

        function updateVisibleStats() {
            if (!portfolioData) return;

            if (!chart || !chart.scales || !chart.scales.x) {
                document.getElementById('activeTickerInfo').innerText = currentLoadedStock || '–';
                document.getElementById('latestPriceInfo').innerText = formatCurrency(getLatestPrice());
                applyStatsFromRange(0, portfolioData.months.length - 1);
                return;
            }

            const xScale = chart.scales.x;
            const startIndex = Number.isFinite(xScale.min) ? Math.max(0, Math.floor(xScale.min)) : 0;
            const endIndex = Number.isFinite(xScale.max) ? Math.min(portfolioData.months.length - 1, Math.ceil(xScale.max)) : portfolioData.months.length - 1;

            updateVisiblePriceAxis(startIndex, endIndex);

            document.title = `Investment Portfolio Rechner – ${currentLoadedStock || 'Aktie'} – ${currentPeriod} Jahre – Kurs € ${getLatestPrice().toLocaleString('de-DE', { maximumFractionDigits: 2 })}`;
            applyStatsFromRange(startIndex, endIndex);
        }

        function updateChart() {
            if (!portfolioData) return;

            // Verwende alle Daten (da sie bereits für den Zeitraum generiert wurden)
            const months = portfolioData.months;
            const portfolioValues = portfolioData.portfolioValues;
            const investedAmounts = portfolioData.investedAmounts;
            const cumulativeDividends = portfolioData.cumulativeDividends;
            const prices = portfolioData.prices;
            const validPrices = prices.filter(price => Number.isFinite(price));
            const maxStockPrice = Math.max(...validPrices);
            const minStockPrice = Math.min(...validPrices);
            const stockPriceRange = maxStockPrice - minStockPrice;

            const stockPricePadding = Number.isFinite(stockPriceRange) && stockPriceRange > 0
                ? stockPriceRange * 0.12
                : maxStockPrice * 0.08;

            const stockPriceAxisMin = Number.isFinite(minStockPrice)
                ? Math.max(0, minStockPrice - stockPricePadding)
                : undefined;

            const stockPriceAxisMax = Number.isFinite(maxStockPrice)
                ? maxStockPrice + stockPricePadding
                : undefined;

            // Erstelle Chart
            const ctx = document.getElementById('portfolioChart').getContext('2d');

            if (chart) {
                chart.destroy();
            }

            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [
                        {
                            label: 'Portfolio Wert (€)',
                            data: portfolioValues,
                            borderColor: '#f97316',
                            backgroundColor: 'rgba(249, 115, 22, 0.08)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.3,
                            pointRadius: 0,
                            pointHoverRadius: 5,
                            pointHitRadius: 20,
                            pointBackgroundColor: '#f97316'
                        },
                        {
                            label: 'Investierte Summe (€)',
                            data: investedAmounts,
                            borderColor: '#fbc531',
                            backgroundColor: 'rgba(251, 197, 49, 0.04)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0,
                            pointRadius: 0,
                            pointHitRadius: 20,
                            pointBackgroundColor: '#fbc531',
                            borderDash: [5, 5]
                        },
                        {
                            label: 'Kumulierte Dividenden (€)',
                            data: cumulativeDividends,
                            borderColor: '#22c55e',
                            backgroundColor: 'rgba(34, 197, 94, 0.08)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.3,
                            pointRadius: 0,
                            pointHitRadius: 20,
                            pointBackgroundColor: '#22c55e'
                        },
                        {
                            label: 'Aktienkurs (€)',
                            data: prices,
                            borderColor: '#38bdf8',
                            backgroundColor: 'rgba(56, 189, 248, 0.06)',
                            borderWidth: 2,
                            fill: false,
                            tension: 0.3,
                            pointRadius: 0,
                            pointHitRadius: 20,
                            pointBackgroundColor: '#38bdf8',
                            yAxisID: 'yPrice'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 929,
                        easing: 'easeOutQuart'
                    },
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    hover: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        zoom: {
                            pan: {
                                enabled: zoomEnabled,
                                mode: 'x',
                                threshold: 2,
                                onPanComplete: function() {
                                    updateVisibleStats();
                                    hideSelectionPopup();
                                }
                            },
                            zoom: {
                                wheel: {
                                    enabled: zoomEnabled,
                                    modifierKey: 'shift',
                                    speed: 0.0025
                                },
                                pinch: {
                                    enabled: zoomEnabled,
                                    threshold: 0.08
                                },
                                drag: {
                                    enabled: zoomEnabled,
                                    backgroundColor: 'rgba(251, 197, 49, 0.16)',
                                    borderColor: '#fbc531',
                                    borderWidth: 1
                                },
                                mode: 'x',
                                onZoomStart: function({ chart, event, point }) {
                                    isDragSelecting = true;

                                    if (point) {
                                        lastPointerPosition = {
                                            x: point.x + chart.canvas.getBoundingClientRect().left,
                                            y: point.y + chart.canvas.getBoundingClientRect().top
                                        };
                                    }

                                    if (event && Number.isFinite(event.clientX)) {
                                        dragSelectionStartIndex = getIndexFromCanvasX(chart, event.clientX);
                                        updateLiveDragSelectionPopup(event.clientX, event.clientY);
                                    } else if (point) {
                                        const absoluteX = point.x + chart.canvas.getBoundingClientRect().left;
                                        const absoluteY = point.y + chart.canvas.getBoundingClientRect().top;
                                        dragSelectionStartIndex = getIndexFromCanvasX(chart, absoluteX);
                                        updateLiveDragSelectionPopup(absoluteX, absoluteY);
                                    }
                                },
                                onZoomComplete: function() {
                                    isDragSelecting = false;
                                    dragSelectionStartIndex = null;
                                    hideSelectionPopup();
                                    updateVisibleStats();
                                }
                            },
                            limits: {
                                x: {
                                    minRange: 12
                                }
                            }
                        },
                        legend: {
                            labels: {
                                color: 'white',
                                font: { size: 14 },
                                padding: 15
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.94)',
                            titleColor: 'white',
                            bodyColor: 'white',
                            borderColor: '#38bdf8',
                            borderWidth: 1,
                            padding: 12,
                            callbacks: {
                                label: function(context) {
                                    const value = context.parsed.y;
                                    return context.dataset.label + ': € ' + value.toLocaleString('de-DE', { maximumFractionDigits: 2 });
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: 'white',
                                callback: function(value) {
                                    return '€ ' + value.toLocaleString('de-DE');
                                }
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        x: {
                            ticks: {
                                color: 'white',
                                maxTicksLimit: 12
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        yPrice: {
                            position: 'right',
                            min: stockPriceAxisMin,
                            max: stockPriceAxisMax,
                            ticks: {
                                color: '#38bdf8',
                                callback: function(value) {
                                    return '€ ' + Number(value).toLocaleString('de-DE', {
                                        maximumFractionDigits: 0
                                    });
                                }
                            },
                            grid: {
                                drawOnChartArea: false
                            }
                        }
                    }
                }
            });

            datasetVisibility.forEach((isVisible, index) => {
                chart.setDatasetVisibility(index, isVisible);
            });

            chart.update();
            syncDatasetCheckboxes();
            updateVisibleStats();
        }
