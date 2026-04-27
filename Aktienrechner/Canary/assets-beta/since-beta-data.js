        function getCacheKey(stock) {
            return `portfolioDataCache_${marketDataProvider}_${stock}`;
        }

        function isStockCacheKey(key) {
            return key.startsWith('portfolioDataCache_');
        }

        function getStockCacheEntries() {
            const entries = [];

            for (let index = 0; index < localStorage.length; index++) {
                const key = localStorage.key(index);

                if (!key || !isStockCacheKey(key)) continue;

                const value = localStorage.getItem(key);
                entries.push({
                    key,
                    value,
                    size: key.length + String(value || '').length
                });
            }

            return entries;
        }

        function getStockCacheSummary() {
            const entries = getStockCacheEntries();
            const bytes = entries.reduce((sum, entry) => sum + entry.size, 0) * 2;
            const tickers = new Set();

            entries.forEach(entry => {
                try {
                    const parsed = JSON.parse(entry.value);
                    if (parsed && parsed.stock) tickers.add(parsed.stock);
                } catch (error) {
                    // Kaputte Cache-Einträge zählen für Größe, aber nicht für Ticker.
                }
            });

            return {
                entries: entries.length,
                tickers: tickers.size,
                bytes
            };
        }

        function clearStockCache() {
            getStockCacheEntries().forEach(entry => localStorage.removeItem(entry.key));
            rawStockData = null;
            currentLoadedStock = null;
            portfolioData = null;
            if (chart) {
                chart.destroy();
                chart = null;
            }
            refreshCacheSummary();
            showStatus('Aktien-Cache geleert.', 'success');
        }

        function saveStockDataToCache(stock, values, dividends) {
            const payload = {
                stock,
                provider: marketDataProvider,
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

        async function fetchYahooMonthly(symbol, years) {
            const period1 = Math.floor(Date.now() / 1000) - (years * 366 * 24 * 60 * 60);
            const period2 = Math.floor(Date.now() / 1000);
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${period1}&period2=${period2}&interval=1mo&events=history%7Cdiv%7Csplit`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Yahoo Finance HTTP-Fehler: ${response.status}`);
            }

            const json = await response.json();
            const result = json && json.chart && Array.isArray(json.chart.result) ? json.chart.result[0] : null;
            const timestamps = result && Array.isArray(result.timestamp) ? result.timestamp : [];
            const closes = result && result.indicators && result.indicators.quote && result.indicators.quote[0]
                ? result.indicators.quote[0].close
                : [];

            const values = timestamps.map((timestamp, index) => ({
                datetime: new Date(timestamp * 1000).toISOString().slice(0, 10),
                close: closes[index]
            })).filter(entry => Number.isFinite(Number(entry.close)) && Number(entry.close) > 0);

            if (values.length === 0) {
                throw new Error('Yahoo Finance lieferte keine nutzbaren Kursdaten');
            }

            return values;
        }

        async function fetchMonthlyValues(symbol, years) {
            if (marketDataProvider === 'yahoo') {
                return fetchYahooMonthly(symbol, years);
            }

            if (marketDataProvider === 'auto') {
                try {
                    return await fetchYahooMonthly(symbol, years);
                } catch (error) {
                    console.warn('Yahoo Finance fehlgeschlagen, Twelve Data Fallback:', error);
                    return fetchTwelveDataMonthly(symbol, years);
                }
            }

            return fetchTwelveDataMonthly(symbol, years);
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
