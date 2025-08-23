export const API_CONFIG = {
    BASE_URL: 'https://requestly.tech/api/mockv2/test/api',
    USERNAME: 'user26614',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
} as const

export const POLLING_CONFIG = {
    DEFAULT_INTERVAL: 5000,
    MIN_INTERVAL: 1000,
    MAX_INTERVAL: 60000,
    STEP: 500,
} as const

export const UI_CONFIG = {
    ITEMS_PER_PAGE: 50,
    SPARKLINE: {
        DEFAULT_WIDTH: 100,
        DEFAULT_HEIGHT: 28,
        STROKE_COLOR: '#3b82f6',
        FILL_COLOR: 'rgba(59, 130, 246, 0.15)',
    },
    CURRENCY_ICON: {
        DEFAULT_SIZE: 20,
        FALLBACK_ICON: 'mdi-currency-usd',
    },
} as const

export const NAVIGATION = {
    PAGES: [
        { title: 'Markets', value: 'markets', icon: 'mdi-chart-line' },
        { title: 'Currencies', value: 'currencies', icon: 'mdi-currency-usd' },
    ],
} as const

export const SORT_CONFIG = {
    KEYS: ['pair', 'last', 'percent', 'volumePrimary', 'volumeSecondary'] as const,
    DIRECTIONS: ['asc', 'desc'] as const,
    DEFAULT_KEY: 'pair' as const,
    DEFAULT_DIRECTION: 'asc' as const,
} as const

export const ERROR_MESSAGES = {
    FETCH_CURRENCIES: 'Failed to load currencies',
    FETCH_MARKET: 'Failed to load market data',
    NETWORK_ERROR: 'Network error occurred',
    UNKNOWN_ERROR: 'An unknown error occurred',
} as const

export const CURRENCY_TYPES = {
    PRIMARY: 'Primary',
    SECONDARY: 'Secondary',
} as const

export const MARKET_CHANGE_DIRECTIONS = {
    UP: 'Up',
    DOWN: 'Down',
    FLAT: 'Flat',
} as const 