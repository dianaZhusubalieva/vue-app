import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { API_CONFIG, ERROR_MESSAGES } from '../constants'

interface ApiError {
    message: string
    status?: number
    code?: string
}

class HttpClient {
    private client: AxiosInstance

    constructor() {
        this.client = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            timeout: API_CONFIG.TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
        })

        this.setupInterceptors()
    }

    private setupInterceptors(): void {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                // Add username parameter to all requests
                if (config.params) {
                    config.params.username = API_CONFIG.USERNAME
                } else {
                    config.params = { username: API_CONFIG.USERNAME }
                }
                return config
            },
            (error) => {
                return Promise.reject(this.handleError(error))
            }
        )

        // Response interceptor
        this.client.interceptors.response.use(
            (response: AxiosResponse) => {
                return response
            },
            (error) => {
                return Promise.reject(this.handleError(error))
            }
        )
    }

    private handleError(error: any): ApiError {
        if (error.response) {
            // Server responded with error status
            return {
                message: error.response.data?.message || ERROR_MESSAGES.UNKNOWN_ERROR,
                status: error.response.status,
                code: error.response.statusText,
            }
        } else if (error.request) {
            // Network error
            return {
                message: ERROR_MESSAGES.NETWORK_ERROR,
                code: 'NETWORK_ERROR',
            }
        } else {
            // Other error
            return {
                message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
                code: 'UNKNOWN_ERROR',
            }
        }
    }

    private async retryRequest<T>(
        requestFn: () => Promise<AxiosResponse<T>>,
        retries: number = API_CONFIG.RETRY_ATTEMPTS
    ): Promise<AxiosResponse<T>> {
        try {
            return await requestFn()
        } catch (error: any) {
            if (retries > 0 && this.isRetryableError(error)) {
                await this.delay(API_CONFIG.RETRY_DELAY)
                return this.retryRequest(requestFn, retries - 1)
            }
            throw error
        }
    }

    private isRetryableError(error: any): boolean {
        // Retry on network errors or 5xx server errors
        return (
            !error.response ||
            (error.response.status >= 500 && error.response.status < 600)
        )
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.retryRequest(() => this.client.get<T>(url, config))
        return response.data
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.retryRequest(() => this.client.post<T>(url, data, config))
        return response.data
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.retryRequest(() => this.client.put<T>(url, data, config))
        return response.data
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.retryRequest(() => this.client.delete<T>(url, config))
        return response.data
    }
}

export const httpClient = new HttpClient() 