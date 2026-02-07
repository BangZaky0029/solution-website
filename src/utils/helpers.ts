// =========================================
// FILE: src/utils/helpers.ts
// =========================================

import type { AxiosError } from 'axios';

/**
 * =========================
 * DATE VALIDATION HELPER
 * =========================
 */
const isValidDate = (date: string | Date | null | undefined): boolean => {
    if (!date) return false;
    const d = new Date(date);
    return !isNaN(d.getTime());
};

/**
 * =========================
 * FORMATTERS
 * =========================
 */
export const formatCurrency = (amount: number | string | null | undefined): string => {
    if (amount === null || amount === undefined) return 'Rp 0';

    const numberAmount =
        typeof amount === 'number'
            ? amount
            : Number(amount);

    if (isNaN(numberAmount)) return 'Rp 0';

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(numberAmount);
};

export const formatDate = (date: string | Date | null | undefined): string => {
    if (!isValidDate(date)) return '-';

    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date!));
};

export const formatDateTime = (dateTime: string | Date | null | undefined): string => {
    if (!isValidDate(dateTime)) return '-';

    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateTime!));
};

/**
 * =========================
 * SUBSCRIPTION HELPERS
 * =========================
 */
export const getSubscriptionStatus = (
    packageName: string | null | undefined,
    expiredAt: string | Date | null | undefined
): 'active' | 'expired' | 'none' => {
    if (!packageName || !isValidDate(expiredAt)) return 'none';
    return new Date(expiredAt!) > new Date() ? 'active' : 'expired';
};

export const getDaysRemaining = (expiredAt: string | Date | null | undefined): number => {
    if (!isValidDate(expiredAt)) return 0;

    const now = new Date();
    const expiredDate = new Date(expiredAt!);
    const diffTime = expiredDate.getTime() - now.getTime();

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
};

/**
 * =========================
 * STRING HELPERS
 * =========================
 */
export const truncateText = (text: string = '', maxLength: number = 100): string => {
    if (typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const capitalizeText = (text: string = ''): string => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getInitials = (name: string = ''): string => {
    if (!name) return '';

    return name
        .split(' ')
        .filter(Boolean)
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

/**
 * =========================
 * PAYMENT HELPERS
 * =========================
 */
export const generatePaymentId = (): string => {
    return `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * =========================
 * AUTH / TOKEN HELPERS
 * =========================
 */
export const isTokenExpired = (token: string | null | undefined): boolean => {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

/**
 * =========================
 * FUNCTION UTILS
 * =========================
 */
type AnyFunction = (...args: unknown[]) => void;

export const debounce = <T extends AnyFunction>(func: T, wait: number = 300): T => {
    let timeout: ReturnType<typeof setTimeout>;
    return ((...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    }) as T;
};

export const throttle = <T extends AnyFunction>(func: T, limit: number = 300): T => {
    let inThrottle = false;
    return ((...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    }) as T;
};

/**
 * =========================
 * ERROR HANDLER
 * =========================
 */
interface ErrorWithResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
    message?: string;
}

export const getErrorMessage = (error: AxiosError | ErrorWithResponse | Error | unknown): string => {
    const err = error as ErrorWithResponse;
    if (err?.response?.data?.message) {
        return err.response.data.message;
    }
    if (err?.message) {
        return err.message;
    }
    return 'Terjadi kesalahan. Silakan coba lagi.';
};

/**
 * =========================
 * ASYNC UTIL
 * =========================
 */
export const sleep = (ms: number = 300): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));
