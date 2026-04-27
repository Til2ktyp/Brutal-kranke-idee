        function getCacheKey(stock) {
            return `portfolioDataCache_${stock}`;
        }

        function saveStockDataToCache(stock, values, dividends) {
            const payload = {
                stock,
                timestamp: Date.now(),
                values,
                dividends
            };
            localStorage.setItem(getCacheKey(stock), JSON.stringify(payload));
        }

        function loadStockDataFromCache(stock) {
            const raw = localStorage.getItem(getCacheKey(stock));
            if (!raw) return null;

            try {
                const parsed = JSON.parse(raw);
                if (!parsed || !Array.isArray(parsed.values) || !Array.isArray(parsed.dividends) || !parsed.timestamp) {
                    return null;
                }
                return parsed;
            } catch (error) {
                console.error('Fehler beim Lesen des Aktien-Caches:', error);
                return null;
            }
        }

        function isCacheFresh(cacheEntry) {
            if (!cacheEntry || !cacheEntry.timestamp) return false;
            return Date.now() - cacheEntry.timestamp < CACHE_MAX_AGE_MS;
        }

        function normalizeTickerInput(value) {
            return String(value || '').toUpperCase().trim();
        }

        function parseMonthlyAmount() {
            return parseInt(document.getElementById('monthlyAmount').value, 10);
        }

        function formatCurrency(value) {
            return '€ ' + Number(value || 0).toLocaleString('de-DE', { maximumFractionDigits: 2 });
        }

        async function fetchTwelveDataMonthly(symbol, years) {
            const outputsize = Math.max(years * 12 + 12, 24);
            const url = `${TWELVE_DATA_URL}?symbol=${encodeURIComponent(symbol)}&interval=1month&outputsize=${outputsize}&order=asc&apikey=${encodeURIComponent(TWELVE_DATA_API_KEY)}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Netzwerkfehler beim Laden der Kursdaten');
            }

            const json = await response.json();

            if (json.status === 'error') {
                throw new Error(json.message || 'Ticker nicht gefunden oder ungültig');
            }

            if (!Array.isArray(json.values) || json.values.length === 0) {
                throw new Error('Keine historischen Daten verfügbar');
            }

            return json.values;
        }

        async function fetchAlphaVantageDividends(symbol) {
            let lastError = null;

            for (const apiKey of ALPHA_VANTAGE_DIVIDEND_KEYS) {
                try {
                    const url = `${ALPHA_VANTAGE_URL}?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${encodeURIComponent(symbol)}&outputsize=full&apikey=${encodeURIComponent(apiKey)}`;
                    const response = await fetch(url);

                    if (!response.ok) {
                        lastError = new Error(`Dividend API HTTP-Fehler: ${response.status}`);
                        continue;
                    }

                    const json = await response.json();

                    if (json['Note']) {
                        lastError = new Error('Alpha Vantage Dividend API-Limit erreicht');
                        continue;
                    }

                    if (json['Error Message'] || json['Information']) {
                        lastError = new Error(json['Error Message'] || json['Information']);
                        continue;
                    }

                    const series = json['Monthly Adjusted Time Series'];
                    if (!series || typeof series !== 'object') {
                        return [];
                    }

                    return Object.entries(series).map(([date, values]) => ({
                        date,
                        dividend_amount: values['7. dividend amount']
                    }));
                } catch (error) {
                    lastError = error;
                }
            }

            console.warn('Alpha Vantage Dividenden konnten nicht geladen werden:', lastError);
            return [];
        }

        function buildDividendMap(dividends) {
            const dividendMap = new Map();

            dividends.forEach(entry => {
                const rawDate = entry.payment_date || entry.ex_date || entry.date || entry.datetime;
                const rawAmount = entry.amount || entry.value || entry.dividend || entry.cash_amount || entry.dividend_amount;
                const amount = parseFloat(rawAmount);

                if (!rawDate || !Number.isFinite(amount) || amount <= 0) {
                    return;
                }

                const monthKey = String(rawDate).slice(0, 7);
                dividendMap.set(monthKey, (dividendMap.get(monthKey) || 0) + amount);
            });

            return dividendMap;
        }

        function buildPortfolioFromMonthlyData(stock, monthlyAmount, years, values, dividendMap) {
            const shouldReinvestDividends = dividendMode === 'reinvest';
            const data = {
                stock: stock,
                monthlyAmount: monthlyAmount,
                dividendMode: dividendMode,
                months: [],
                portfolioValues: [],
                investedAmounts: [],
                cumulativeDividends: [],
                prices: []
            };

            const sortedEntries = values
                .map(entry => ({
                    date: entry.datetime,
                    close: parseFloat(entry.close),
                    dividend: dividendMap.get(String(entry.datetime).slice(0, 7)) || 0
                }))
                .filter(entry => Number.isFinite(entry.close) && entry.close > 0)
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            if (sortedEntries.length === 0) {
                throw new Error('Keine nutzbaren Kursdaten gefunden');
            }

            const monthsNeeded = years * 12;
            const filteredEntries = sortedEntries.slice(-monthsNeeded);

            if (filteredEntries.length < 2) {
                throw new Error('Zu wenig historische Daten für diesen Zeitraum');
            }

            let shares = 0;
            let cumulativeDividend = 0;
            let paidOutDividendCash = 0;
            let reinvestedDividendCapital = 0;

            filteredEntries.forEach((entry, index) => {
                const price = entry.close;
                const dividendPerShare = entry.dividend;

                let dividendCash = 0;
                if (dividendPerShare > 0) {
                    dividendCash = shares * dividendPerShare;
                    if (shouldReinvestDividends) {
                        shares += dividendCash / price;
                        reinvestedDividendCapital += dividendCash;
                    } else {
                        paidOutDividendCash += dividendCash;
                    }
                    cumulativeDividend += dividendCash;
                }

                shares += monthlyAmount / price;

                const monthlyInvested = monthlyAmount * (index + 1);
                const investedAmount = shouldReinvestDividends
                    ? monthlyInvested + reinvestedDividendCapital
                    : monthlyInvested;
                const portfolioValue = shouldReinvestDividends
                    ? shares * price
                    : shares * price + paidOutDividendCash;

                data.months.push(entry.date);
                data.portfolioValues.push(Math.round(portfolioValue * 100) / 100);
                data.investedAmounts.push(Math.round(investedAmount * 100) / 100);
                data.cumulativeDividends.push(Math.round(cumulativeDividend * 100) / 100);
                data.prices.push(Math.round(price * 100) / 100);
            });

            return data;
        }
        function recalculatePortfolioFromRawData() {
            if (!rawStockData || !currentLoadedStock) return false;

            const monthlyAmount = parseMonthlyAmount();
            if (!monthlyAmount || monthlyAmount <= 0) return false;

            const dividendMap = buildDividendMap(rawStockData.dividends);
            portfolioData = buildPortfolioFromMonthlyData(
                currentLoadedStock,
                monthlyAmount,
                currentPeriod,
                rawStockData.values,
                dividendMap
            );
            updateQuickAmountButtons();
            updateChart();
            showStatus(`Zeitraum lokal aktualisiert: ${currentPeriod} Jahre für ${currentLoadedStock}`, 'success');
            return true;
        }
