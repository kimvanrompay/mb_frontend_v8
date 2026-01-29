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
