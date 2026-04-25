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
        function selectStock(ticker, name) {
            stockInput.value = ticker;
            autocompleteList.classList.remove('show');
            clearStatus();
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

            if (zoomEnabled) {
                resetBtn.style.display = 'inline-flex';
                zoomHint.style.display = 'block';
            } else {
                resetBtn.style.display = 'none';
                zoomHint.style.display = 'none';
            }
        }

        function resetZoom() {
            if (chart) {
                chart.resetZoom();
                updateVisibleStats();
                hideSelectionPopup();
            }
        }

        const stockInput = document.getElementById('stock');
        const autocompleteList = document.getElementById('autocompleteList');

        stockInput.addEventListener('input', function() {
            const value = this.value.toLowerCase().trim();
            
            if (value.length === 0) {
                autocompleteList.classList.remove('show');
                return;
            }

            const filtered = stocks.filter(stock =>
                stock.name.toLowerCase().includes(value) ||
                stock.ticker.toLowerCase().includes(value)
            );

            if (filtered.length === 0) {
                autocompleteList.classList.remove('show');
                return;
            }

            autocompleteList.innerHTML = filtered.map(stock =>
                `<div class="autocomplete-item" onclick="selectStock('${stock.ticker}', '${stock.name}')">
                    <span class="autocomplete-item-ticker">${stock.ticker}</span>
                    <span class="autocomplete-item-name">${stock.name}</span>
                </div>`
            ).join('');

            autocompleteList.classList.add('show');
        });

        stockInput.addEventListener('focus', function() {
            if (this.value.length > 0) {
                this.dispatchEvent(new Event('input'));
            }
        });

        document.addEventListener('click', function(e) {
            if (e.target !== stockInput) {
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