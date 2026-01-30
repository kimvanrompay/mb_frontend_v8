export interface Job {
    id: string;
    title: string;
    department?: string;
    location: string;
    status: 'open' | 'closed' | 'filled';
    employment_type: 'full-time' | 'part-time' | 'contract' | 'remote' | 'internship';
    description?: string;
    salary_range?: string;
    positions_available: number;
    positions_remaining: number;
    hired_count: number;
    fill_progress_percentage: number;
    is_fully_filled: boolean;

    // Application counts
    applications_count: number;
    new_applications_count: number;
    pending_review_count: number;
    applications_per_day: number;
    hire_conversion_rate: number;

    // Legacy fields for backward compatibility
    total_applications?: number;
    pending_applications?: number;
    interviewed_count?: number;

    // Deadline info
    deadline?: string | null;
    deadline_passed: boolean;
    days_until_deadline?: number | null;
    deadline_urgency?: string | null;
    days_since_posted: number;

    // Profile completion
    ideal_profile_complete: boolean;
    ideal_profile_completion_percentage: number;

    // Status flags
    needs_attention: boolean;
    can_accept_applications: boolean;
    starred: boolean;

    // Actions
    actions?: {
        can_close: boolean;
        can_reopen: boolean;
        can_mark_filled: boolean;
    };

    // Culture & Preferences
    work_style?: 'remote' | 'hybrid' | 'on-site' | 'flexible';
    collaboration_level?: 'solo' | 'small-team' | 'cross-functional' | 'large-team';
    autonomy_level?: 'high' | 'medium' | 'low';
    structure_preference?: 'structured' | 'flexible' | 'balanced';
    stress_environment?: 'low' | 'medium' | 'high';
    innovation_requirement?: 'cutting-edge' | 'progressive' | 'balanced' | 'conservative';
    decision_style?: 'consensus' | 'top-down' | 'data-driven' | 'collaborative';

    // Weights
    personality_weight?: number;
    culture_fit_importance?: number;
    minimum_match_score?: number;

    // Timestamps
    created_at: string;
    updated_at: string;
}

export interface CreateJobRequest {
    title: string;
    department: string;
    location: string;
    employment_type: string;
    description?: string;
    positions_available?: number;
    deadline?: string;
    work_style?: string;
    collaboration_level?: string;
    autonomy_level?: string;
    structure_preference?: string;
    stress_environment?: string;
    innovation_requirement?: string;
    decision_style?: string;
    personality_weight?: number;
    culture_fit_importance?: number;
    minimum_match_score?: number;
}
