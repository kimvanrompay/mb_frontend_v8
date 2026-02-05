export interface AssessmentStats {
    total_sent: number;
    completed: number;
    pending: number;
    expired: number;
    by_type: {
        mbti: number;
        enneagram: number;
        skill_test: number;
        custom: number;
    };
    completion_rate: number;
    average_completion_time: number | null;
}

export interface TestCatalogItem {
    id: number;
    test_key: string;
    name: string;
    description: string;
    category: 'psychology' | 'cognitive' | 'skill' | 'technical';
    duration_minutes: number;
    question_count: number;
    price_cents: number;
    price_euros: number;
    requires_payment: boolean;
    is_free: boolean;
    supported_locales: string[];
    is_default: boolean;
}

export interface TestCatalogResponse {
    tests: TestCatalogItem[];
    total_count: number;
}
