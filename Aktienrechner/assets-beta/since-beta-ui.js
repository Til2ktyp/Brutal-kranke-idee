        function showStatus(message, type = 'success') {
            const banner = document.getElementById('statusBanner');
            if (!banner) return;

            banner.textContent = message;
            banner.className = `status-banner show ${type}`;
        }

        function clearStatus() {
            const banner = document.getElementById('statusBanner');
            if (!banner) return;

            banner.textContent = '';
            banner.className = 'status-banner';
        }

        function updateQuickAmountButtons() {
            const currentAmount = parseMonthlyAmount();
            document.querySelectorAll('.quick-amount-btn').forEach(button => {
                const numericValue = parseInt(button.textContent.replace(/[^0-9]/g, ''), 10);
                button.classList.toggle('active', numericValue === currentAmount);
            });
        }

        function setMonthlyAmount(amount) {
            document.getElementById('monthlyAmount').value = amount;
            updateQuickAmountButtons();

            if (rawStockData && currentLoadedStock) {
                recalculatePortfolioFromRawData();
            }
        }
        function setLoadingState(isLoading) {
            isLoadingData = isLoading;

            const loadingMessage = document.getElementById('loadingMsg');
            const chartContainer = document.querySelector('.chart-container');

            if (loadingMessage) {
                loadingMessage.style.display = isLoading ? 'block' : 'none';
            }

            if (!chartContainer) return;

            if (isLoading) {
                chartContainer.classList.remove('chart-data-enter');
                chartContainer.classList.add('chart-data-loading');
                return;
            }

            chartContainer.classList.remove('chart-data-loading');
            chartContainer.classList.add('chart-data-enter');

            window.setTimeout(() => {
                chartContainer.classList.remove('chart-data-enter');
            }, 520);
        }
        
        function hideSelectionPopup() {
            const popup = document.getElementById('selectionPopup');
            if (!popup) return;
            popup.classList.remove('show');
        }

        function showSelectionPopupAt(x, y, html) {
            const popup = document.getElementById('selectionPopup');
            const content = document.getElementById('selectionPopupContent');
            if (!popup || !content) return;

            content.innerHTML = html;
            popup.classList.add('show');

            const popupWidth = popup.offsetWidth || 280;
            const popupHeight = popup.offsetHeight || 180;
            const offsetX = 18;
            const offsetY = 18;

            const left = Math.min(window.innerWidth - popupWidth - 12, x + offsetX);
            const top = Math.min(window.innerHeight - popupHeight - 12, y + offsetY);

            popup.style.left = `${Math.max(12, left)}px`;
            popup.style.top = `${Math.max(12, top)}px`;
        }
        function selectStock(ticker, name, shouldLoad = false) {
            stockInput.value = ticker;
            if (autocompleteList) {
                autocompleteList.classList.remove('show');
            }
            clearStatus();

            if (shouldLoad) {
                loadData();
            }
        }

        function toggleGraphSettingsPanel() {
            const panel = document.getElementById('graphSettingsPanel');
            panel.classList.toggle('show');
        }

        function saveDatasetVisibility() {
            localStorage.setItem('datasetVisibility', JSON.stringify(datasetVisibility));
        }

        function loadDatasetVisibility() {
            const saved = localStorage.getItem('datasetVisibility');
            if (!saved) return;

            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length === 4) {
                    datasetVisibility = parsed.map(value => Boolean(value));
                }
            } catch (error) {
                console.error('Fehler beim Laden der Graph-Sichtbarkeit:', error);
            }
        }

        function syncDatasetCheckboxes() {
            document.querySelectorAll('#graphSettingsPanel input[type="checkbox"]').forEach(checkbox => {
                const index = Number(checkbox.dataset.datasetIndex);
                checkbox.checked = datasetVisibility[index] !== false;
            });
        }

        function toggleDatasetVisibility(checkbox) {
            const datasetIndex = Number(checkbox.dataset.datasetIndex);
            datasetVisibility[datasetIndex] = checkbox.checked;
            saveDatasetVisibility();

            if (chart) {
                chart.setDatasetVisibility(datasetIndex, checkbox.checked);
                chart.update();
                updateVisibleStats();
            }
        }
                function updatePeriodDisplay() {
            const periodDisplay = document.getElementById('periodDisplay');
            if (periodDisplay) {
                periodDisplay.innerText = currentPeriod === 1 ? '1 Jahr' : `${currentPeriod} Jahre`;
            }
        }

        function syncPeriodDropdownSelection() {
            document.querySelectorAll('.period-option').forEach(option => {
                option.classList.toggle('active', Number(option.dataset.years) === currentPeriod);
            });
        }

        function togglePeriodDropdown() {
            const dropdown = document.getElementById('periodDropdown');
            if (!dropdown) return;
            syncPeriodDropdownSelection();
            dropdown.classList.toggle('show');
        }

        function closePeriodDropdown() {
            const dropdown = document.getElementById('periodDropdown');
            if (!dropdown) return;
            dropdown.classList.remove('show');
        }

        function selectPeriodOption(years) {
            setPeriod(years);
            syncPeriodDropdownSelection();
            closePeriodDropdown();
        }

        function setPeriod(years) {
            currentPeriod = Math.max(MIN_PERIOD_YEARS, Math.min(MAX_PERIOD_YEARS, years));
            zoomEnabled = currentPeriod >= 5;
            updatePeriodDisplay();
            syncPeriodDropdownSelection();
            updateZoomControls();

            if (periodChangeTimeout) {
                clearTimeout(periodChangeTimeout);
            }
            
            if (portfolioData) {
                periodChangeTimeout = setTimeout(() => {
                    recalculatePortfolioFromRawData();
                }, 500);
            }
        }

        function changePeriod(delta) {
            setPeriod(currentPeriod + delta);
        }

        function updateZoomControls() {
            const resetBtn = document.getElementById('resetZoomBtn');
            const zoomHint = document.getElementById('zoomHint');
            const mobileZoomControls = document.getElementById('mobileZoomControls');
            const isMobileViewport = window.matchMedia('(max-width: 640px)').matches;

            if (zoomEnabled) {
                resetBtn.style.display = 'inline-flex';
                zoomHint.style.display = 'block';
                zoomHint.textContent = isMobileViewport
                    ? 'Mit + und − zoomst du den Zeitraum, mit ← und → verschiebst du den sichtbaren Bereich.'
                    : 'Ab 5 Jahren: Mit dem Mausrad scrollen, mit Shift + Mausrad zoomen, mit zwei Fingern seitlich scrollen oder mit gedrückter Maustaste einen Bereich markieren.';
                if (mobileZoomControls) {
                    mobileZoomControls.classList.add('show');
                }
            } else {
                resetBtn.style.display = 'none';
                zoomHint.style.display = 'none';
                if (mobileZoomControls) {
                    mobileZoomControls.classList.remove('show');
                }
            }
        }

        function resetZoom() {
            if (chart) {
                chart.resetZoom();
                updateVisibleStats();
                hideSelectionPopup();
            }
        }

        function getVisibleXRange() {
            if (!chart || !portfolioData || !chart.scales || !chart.scales.x) return null;

            const xScale = chart.scales.x;
            const maxIndex = portfolioData.months.length - 1;
            const min = Number.isFinite(xScale.min) ? xScale.min : 0;
            const max = Number.isFinite(xScale.max) ? xScale.max : maxIndex;

            return {
                min: Math.max(0, min),
                max: Math.min(maxIndex, max),
                maxIndex
            };
        }

        function applyMobileXRange(min, max) {
            if (!chart || !portfolioData || !chart.options || !chart.options.scales || !chart.options.scales.x) return;

            const maxIndex = portfolioData.months.length - 1;
            const minimumRange = Math.min(12, maxIndex);
            let nextMin = Math.max(0, min);
            let nextMax = Math.min(maxIndex, max);

            if (nextMax - nextMin < minimumRange) {
                const center = (nextMin + nextMax) / 2;
                nextMin = center - minimumRange / 2;
                nextMax = center + minimumRange / 2;
            }

            if (nextMin < 0) {
                nextMax -= nextMin;
                nextMin = 0;
            }

            if (nextMax > maxIndex) {
                nextMin -= nextMax - maxIndex;
                nextMax = maxIndex;
            }

            chart.options.scales.x.min = Math.max(0, nextMin);
            chart.options.scales.x.max = Math.min(maxIndex, nextMax);
            triggerMobileChartMotion();
            chart.update();
            updateVisibleStats();
            hideSelectionPopup();
        }

        function triggerMobileChartMotion() {
            const chartContainer = document.querySelector('.chart-container');
            if (!chartContainer) return;

            chartContainer.classList.remove('mobile-chart-motion');
            void chartContainer.offsetWidth;
            chartContainer.classList.add('mobile-chart-motion');

            window.setTimeout(() => {
                chartContainer.classList.remove('mobile-chart-motion');
            }, 360);
        }

        function zoomMobileChart(direction) {
            if (!zoomEnabled) return;

            const range = getVisibleXRange();
            if (!range) return;

            const currentWidth = range.max - range.min;
            const factor = direction > 0 ? 0.72 : 1.34;
            const nextWidth = currentWidth * factor;
            const center = (range.min + range.max) / 2;

            applyMobileXRange(center - nextWidth / 2, center + nextWidth / 2);
        }

        function panMobileChart(direction) {
            if (!zoomEnabled) return;

            const range = getVisibleXRange();
            if (!range) return;

            const currentWidth = range.max - range.min;
            const offset = currentWidth * 0.28 * direction;

            applyMobileXRange(range.min + offset, range.max + offset);
        }

        const stockInput = document.getElementById('stock');
        const autocompleteList = document.getElementById('autocompleteList');

        document.addEventListener('click', function(e) {
            if (autocompleteList && e.target !== stockInput) {
                autocompleteList.classList.remove('show');
            }

            const graphPanel = document.getElementById('graphSettingsPanel');
            const graphButton = document.querySelector('.graph-settings-btn');

            if (graphPanel && graphButton && !graphPanel.contains(e.target) && !graphButton.contains(e.target)) {
                graphPanel.classList.remove('show');
            }

            const periodSelector = document.querySelector('.period-selector');
            if (periodSelector && !periodSelector.contains(e.target)) {
                closePeriodDropdown();
            }
        });

        window.addEventListener('resize', updateZoomControls);

        let lastTouchEnd = 0;

        document.addEventListener('touchend', function(event) {
            const now = Date.now();

            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }

            lastTouchEnd = now;
        }, { passive: false });

        let lastInteractiveTouchEnd = 0;

        document.addEventListener('touchend', function(event) {
            const target = event.target.closest('button, a, input, .period-display');
            if (!target) return;

            const now = Date.now();

            if (now - lastInteractiveTouchEnd <= 420) {
                event.preventDefault();

                if (!target.matches('input, select, textarea')) {
                    window.requestAnimationFrame(() => {
                        target.click();
                    });
                }
            }

            lastInteractiveTouchEnd = now;
        }, { passive: false, capture: true });

        ['gesturestart', 'gesturechange', 'gestureend'].forEach(eventName => {
            document.addEventListener(eventName, function(event) {
                event.preventDefault();
            }, { passive: false });
        });

        const chartContainer = document.querySelector('.chart-container');

        if (chartContainer) {
            chartContainer.addEventListener('selectstart', event => {
                event.preventDefault();
            });

            chartContainer.addEventListener('contextmenu', event => {
                event.preventDefault();
            });
        }
