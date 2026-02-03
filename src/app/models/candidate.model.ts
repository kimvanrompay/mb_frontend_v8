export interface Candidate {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    phone: string | null;
    status: string;
    source: 'manual' | 'invited' | 'applied';
    preferred_language: string;
    cv_url: string | null;
    applications_count: number;
    latest_application_id: number | null;
    created_at: string;
    updated_at: string;
    // Optional invitation fields (when source is 'invited')
    invitation_status?: string | null;
    invited_by?: {
        id: number;
        name: string;
    } | null;
    invited_for_job?: {
        id: number;
        title: string;
    } | null;
    invitation_sent_at?: string | null;
    invitation_accepted_at?: string | null;
    invitation_expired?: boolean;
}

export interface CandidateDetail extends Candidate {
    applications: ApplicationSummary[];
    notes: string | null;
    events: CandidateEvent[];
}

export interface ApplicationSummary {
    id: number;
    position_applied: string;
    status: string;
    mbti_result: string | null;
    submitted_at: string;
    skill_tests_count: number;
    all_tests_passed: boolean;
}

export interface CandidateEvent {
    id: number;
    event_type: string;
    triggered_by: {
        id: number;
        name: string;
    } | null;
    metadata: any;
    occurred_at: string;
}

export interface CandidatesResponse {
    candidates: Candidate[];
}

export interface CandidateResponse {
    candidate: CandidateDetail;
}

export interface CreateCandidateRequest {
    candidate: {
        first_name: string;
        last_name: string;
        email: string;
        phone?: string;
        cv_url?: string;
        notes?: string;
        preferred_language?: string;
    };
}

export interface InviteCandidateRequest {
    job_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    preferred_language?: string;
}

export interface CheckEmailResponse {
    exists: boolean;
    candidate?: {
        id: number;
        full_name: string;
        status: string;
        source: string;
        can_be_invited: boolean;
        invitation_status: string | null;
    };
}
