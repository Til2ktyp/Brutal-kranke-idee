        let chart = null;
        let currentPeriod = 10;
        let portfolioData = null;
        let zoomEnabled = false;
        let lastTouchX = null;
        let datasetVisibility = [true, true, true, true];
        let periodChangeTimeout = null;
        let rawStockData = null;
        let currentLoadedStock = null;
        let lastRequestedTicker = null;
        let isLoadingData = false;
        let latestLoadRequestId = 0;
        let realityMode = 'LARP';
        let currentRealityCheckMessage = 'Lade Daten, dann gibt\'s hier die kleine finanzielle Respektschelle.';
        let lastPointerPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let isDragSelecting = false;
        let dragSelectionStartIndex = null;
        const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
        const MAX_PERIOD_YEARS = 40;
        const MIN_PERIOD_YEARS = 1;

        const TWELVE_DATA_API_KEY = 'e4cfbe247e62449c999d101f5fc4dc6a';
        const TWELVE_DATA_URL = 'https://api.twelvedata.com/time_series';
        const ALPHA_VANTAGE_DIVIDEND_KEYS = [
            'N0CWHO7Y381KVSYP',
            'SKITKTP494KO86G7',
            'I9WO5YY3PHDUGJT0',
            'U2Q57V7DZGHUQQJP'
        ];
        const ALPHA_VANTAGE_URL = 'https://www.alphavantage.co/query';

        // Liste beliebter Aktien
        const stocks = [
            { name: 'Nvidia', ticker: 'NVDA' },
            { name: 'Apple', ticker: 'AAPL' },
            { name: 'Microsoft', ticker: 'MSFT' },
            { name: 'Tesla', ticker: 'TSLA' },
            { name: 'Amazon', ticker: 'AMZN' },
            { name: 'Google', ticker: 'GOOGL' },
            { name: 'Meta', ticker: 'META' },
            { name: 'Netflix', ticker: 'NFLX' },
            { name: 'Intel', ticker: 'INTC' },
            { name: 'AMD', ticker: 'AMD' },
            { name: 'Nestle', ticker: 'NSRGY' },
            { name: 'Coca Cola', ticker: 'KO' },
            { name: 'McDonalds', ticker: 'MCD' },
            { name: 'Nike', ticker: 'NKE' },
            { name: 'Volkswagen', ticker: 'VWAGY' },
            { name: 'BMW', ticker: 'BMWYY' },
            { name: 'Siemens', ticker: 'SIEGY' },
            { name: 'SAP', ticker: 'SAP' },
            { name: 'Adidas', ticker: 'ADDYY' },
            { name: 'Berkshire Hathaway', ticker: 'BRK.B' }
        ];
