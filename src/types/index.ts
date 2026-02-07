// =========================================
// Type Definitions for Solution Website
// =========================================

// ========================================
// USER & AUTH TYPES
// ========================================
export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role?: string;
    is_verified?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    phone: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: User;
    token?: string;
    otp?: string;
    otpDuration?: number;
}

// ========================================
// PACKAGE & SUBSCRIPTION TYPES
// ========================================
export interface Package {
    id: number;
    name: string;
    price: number;
    duration_days: number;
    description: string | string[];
    status?: string;
    is_popular?: boolean;
    created_at?: string;
}

export interface UserToken {
    id: number;
    user_id: number;
    package_id: number;
    package_name: string;
    token: string;
    is_active: number;
    activated_at: string;
    expired_at: string;
    created_at?: string;
}

export interface ActivePackage {
    token_id: number;
    package_id: number;
    package_name: string;
    activated_at: string;
    expired_at: string;
}

// ========================================
// PAYMENT TYPES
// ========================================
export interface Payment {
    id: number;
    user_id: number;
    package_id: number;
    package_name: string;
    amount: number;
    method: string;
    status: 'pending' | 'confirmed' | 'expired' | 'cancelled';
    proof_url?: string;
    duration_days?: number;
    created_at: string;
    updated_at?: string;
}

export interface PaymentFormData {
    email: string;
    phone: string;
    paymentMethod: string;
    proofFile?: File;
}

export interface PaymentResponse {
    success: boolean;
    message: string;
    payment_id?: number;
    hasActive?: boolean;
    warning?: string;
}

// ========================================
// FEATURE ACCESS TYPES
// ========================================
export interface Feature {
    id: number;
    name: string;
    code: string;
    description?: string;
    status: 'free' | 'premium';
    created_at?: string;
}

export type FeatureAccessStatus = 'free' | 'subscribed' | 'premium' | 'locked' | 'loading';

export interface FeatureAccessDetails {
    package_name: string;
    active_features: Feature[];
    expired_at: string | null;
}

export type FeatureAccessMap = Record<string, FeatureAccessStatus>;

// ========================================
// API RESPONSE TYPES
// ========================================
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    total: number;
    page: number;
    limit: number;
}

// ========================================
// COMPONENT PROP TYPES
// ========================================
export interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    children: React.ReactNode;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export interface ToastType {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

// ========================================
// FORM VALIDATION TYPES
// ========================================
export type ValidationErrors = Record<string, string>;

export interface FormField {
    name: string;
    value: string;
    error?: string;
}

// ========================================
// UTILITY TYPES
// ========================================
export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
