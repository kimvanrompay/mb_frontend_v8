export interface Job {
    id: number;
    title: string;
    description: string;
    status: 'open' | 'closed' | 'filled';
    location: string;
    employment_type: string;
    salary_range: string;
    positions_available: number;
    positions_remaining: number;
    hired_count: number;
    fill_progress_percentage: number;
    is_fully_filled: boolean;
    deadline: string | null;
    deadline_passed: boolean;
    days_until_deadline: number | null;
    deadline_urgency: 'none' | 'low' | 'medium' | 'high';
    days_since_posted: number;
    applications_count: number;
    new_applications_count: number;
    pending_review_count: number;
    applications_per_day: number;
    hire_conversion_rate: number;
    ideal_profile_complete: boolean;
    ideal_profile_completion_percentage: number;
    needs_attention: boolean;
    can_accept_applications: boolean;
    actions: {
        can_close: boolean;
        can_reopen: boolean;
        can_mark_filled: boolean;
    };
    created_at: string;
    updated_at: string;
}

export interface JobsResponse {
    jobs: Job[];
}

export interface JobResponse {
    job: Job;
    message?: string;
}
