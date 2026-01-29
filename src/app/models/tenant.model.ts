export interface TenantStats {
    total_users: number;
    total_jobs: number;
    total_candidates: number;
    total_employees: number;
}

export interface SubscriptionPlan {
    id: number;
    name: string;
    tier: 'starter' | 'professional' | 'enterprise';
    max_seats: number | null;
    max_responses: number | null;
}

export interface Subscription {
    id: number;
    status: 'trialing' | 'active' | 'canceled' | 'past_due';
    trial_ends_at: string | null;
    trial_days_remaining: number | null;
    on_trial: boolean;
    plan: SubscriptionPlan;
}

export interface Tenant {
    id: number;
    name: string;
    subdomain: string;
    logo: string | null;
    logo_or_avatar: string;
    subscription: Subscription | null;
    stats: TenantStats;
}

export interface TenantResponse {
    tenant: Tenant;
}
