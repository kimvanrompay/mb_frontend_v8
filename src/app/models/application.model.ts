export interface Application {
    id: number;
    candidate: {
        id: number;
        full_name: string;
        email: string;
    };
    position_applied: string;
    status: 'pending' | 'under_review' | 'interviewed' | 'offered' | 'hired' | 'rejected';
    mbti_result: string | null;
    submitted_at: string;
    reviewed_at: string | null;
    reviewer: {
        id: number;
        full_name: string;
    } | null;
    test_summary: {
        total_tests: number;
        passed_tests: number;
        average_score: number;
    };
}

export interface ApplicationDetail extends Application {
    skill_tests: SkillTest[];
    notes: string | null;
}

export interface SkillTest {
    id: number;
    test_name: string;
    test_type: string;
    score: number;
    max_score: number;
    percentage_score: number;
    passed: boolean;
    results: any;
}

export interface ApplicationsResponse {
    applications: Application[];
}

export interface ApplicationResponse {
    application: ApplicationDetail;
}

export interface CreateApplicationRequest {
    candidate_id: number;
    job_id: number;
    application?: {
        notes?: string;
    };
    mbti_result?: string;
    skill_tests?: {
        test_name: string;
        test_type: string;
        score: number;
        max_score: number;
        results: any;
    }[];
}

export interface HireRequest {
    position?: string;
}

export interface RejectRequest {
    reason?: string;
}
