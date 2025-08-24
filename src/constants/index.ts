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
    TABLE: {
        BORDER_RADIUS: 8,
        HEADER_BACKGROUND: 'rgba(0, 0, 0, 0.02)',
        HEADER_FONT_SIZE: '0.75rem',
        HEADER_LETTER_SPACING: '0.5px',
    },
    LAYOUT: {
        CONTAINER_MAX_WIDTH: 1200,
        CARD_BORDER_RADIUS: 12,
    },
} as const

export const NAVIGATION = {
    PAGES: [
        { title: 'Markets', value: 'markets', icon: 'mdi-chart-line', component: 'MarketView' },
        { title: 'Currencies', value: 'currencies', icon: 'mdi-currency-usd', component: 'CurrenciesView' },
    ],
    DEFAULT_PAGE: 'markets',
    DRAWER_BREAKPOINT: 960,
} as const

export const SORT_CONFIG = {
    KEYS: ['pair', 'last', 'percent', 'volumePrimary', 'volumeSecondary'] as const,
    DIRECTIONS: ['asc', 'desc'] as const,
    DEFAULT_KEY: 'pair' as const,
    DEFAULT_DIRECTION: 'asc' as const,
} as const

export const TABLE_HEADERS = {
    MARKETS: [
        { title: 'Pair', key: 'pair', sortable: true, align: 'start' as const },
        { title: 'Last', key: 'last', sortable: true, align: 'end' as const },
        { title: 'Change %', key: 'percent', sortable: true, align: 'end' as const },
        { title: 'Vol (Primary)', key: 'volumePrimary', sortable: true, align: 'end' as const },
        { title: 'Vol (Secondary)', key: 'volumeSecondary', sortable: true, align: 'end' as const },
        { title: 'Trend', key: 'trend', sortable: false, align: 'end' as const },
    ],
} as const

export const LABELS = {
    MARKETS: {
        TITLE: 'Crypto Markets',
        SEARCH_PLACEHOLDER: 'Search pair… (e.g., ETH, AUD, ETH/AUD)',
        SECONDARY_FILTER_LABEL: 'Filter by Secondary Currency',
        POLL_LABEL: 'Poll (ms)',
        REFRESH_BUTTON: 'Refresh',
        CLEAR_FILTERS_BUTTON: 'Clear Filters',
        RESULTS_SUMMARY: {
            SINGLE: 'result',
            PLURAL: 'results',
        },
        LAST_UPDATED_PREFIX: 'Updated:',
    },
    COMMON: {
        LOADING: 'Loading...',
        NO_DATA: 'No results found',
        ERROR: 'Error occurred',
        CLEAR: 'Clear',
        SEARCH: 'Search',
        FILTER: 'Filter',
    },
} as const

export const ERROR_MESSAGES = {
    FETCH_CURRENCIES: 'Failed to load currencies',
    FETCH_MARKET: 'Failed to load market data',
    NETWORK_ERROR: 'Network error occurred',
    UNKNOWN_ERROR: 'An unknown error occurred',
    PAGE_NOT_FOUND: 'Page Not Found',
    PAGE_NOT_FOUND_DESCRIPTION: 'The requested page could not be found.',
    GO_TO_HOME: 'Go to Markets',
} as const

export const ICONS = {
    SEARCH: 'mdi-magnify',
    CLEAR: 'mdi-close-circle',
    REFRESH: 'mdi-refresh',
    FILTER_OFF: 'mdi-filter-off',
    ALERT: 'mdi-alert-circle',
    DATABASE_OFF: 'mdi-database-off',
    HOME: 'mdi-home',
    ARROW_RIGHT: 'mdi-arrow-right',
    VIEW_DASHBOARD: 'mdi-view-dashboard',
} as const

export const STYLES = {
    COLORS: {
        SUCCESS: 'text-success',
        ERROR: 'text-error',
        GREY: 'text-grey',
        PRIMARY: 'primary',
    },
} as const 