export interface Job {
    id: string;
    title: string;
    department: string;
    location: string;
    status: 'open' | 'closed' | 'filled';
    employment_type: 'full-time' | 'part-time' | 'contract' | 'remote' | 'internship';
    description?: string;
    positions_available: number;
    positions_remaining: number;
    total_applications: number;
    pending_applications: number;
    interviewed_count: number;
    hired_count: number;
    deadline?: string;
    needs_attention: boolean;

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
