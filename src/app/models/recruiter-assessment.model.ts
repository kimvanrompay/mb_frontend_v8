// Supported locales
export type Locale = 'en' | 'nl' | 'fr' | 'de' | 'es';

// Enneagram types
export type EnneagramType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// Answer value range (Likert scale)
export type AnswerValue = 1 | 2 | 3 | 4 | 5;

// Question content in multiple languages
export interface QuestionContent {
    en: string;
    nl: string;
    fr: string;
    de: string;
    es: string;
}

// Single question
export interface RecruiterQuestion {
    id: number;
    enneagram_type: EnneagramType;
    content: QuestionContent;
}

// Response from GET /recruiter_questions
export interface RecruiterQuestionsResponse {
    questions: RecruiterQuestion[];
    locale: Locale;
    supported_locales: Locale[];
}

// Single answer
export interface Answer {
    question_id: number;
    value: AnswerValue;
}

// Assessment submission payload
export interface AssessmentSubmission {
    locale: Locale;
    user_email: string;
    answers: Answer[];
}

// Assessment score breakdown
export interface ScoreBreakdown {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
    '6': number;
    '7': number;
    '8': number;
    '9': number;
}

// Assessment result
export interface AssessmentResult {
    assessment_id: number;
    dominant_type: EnneagramType;
    type_name: string;
    type_description: string;
    locale: Locale;
    all_scores: ScoreBreakdown;
}

// Response from POST /recruiter_assessment
export interface AssessmentResponse {
    message: string;
    result: AssessmentResult;
}

// API Error response
export interface ApiError {
    error: string;
    field?: string;
    details?: string | string[];
}

// Type names by language
export const TYPE_NAMES: Record<EnneagramType, QuestionContent> = {
    1: {
        en: 'The Reformer',
        nl: 'De Hervormer',
        fr: 'Le Réformateur',
        de: 'Der Reformer',
        es: 'El Reformador'
    },
    2: {
        en: 'The Helper',
        nl: 'De Helper',
        fr: 'L\'Aidant',
        de: 'Der Helfer',
        es: 'El Ayudador'
    },
    3: {
        en: 'The Achiever',
        nl: 'De Presteerder',
        fr: 'Le Battant',
        de: 'Der Macher',
        es: 'El Triunfador'
    },
    4: {
        en: 'The Individualist',
        nl: 'De Individualist',
        fr: 'L\'Individualiste',
        de: 'Der Individualist',
        es: 'El Individualista'
    },
    5: {
        en: 'The Observer',
        nl: 'De Waarnemer',
        fr: 'L\'Observateur',
        de: 'Der Beobachter',
        es: 'El Observador'
    },
    6: {
        en: 'The Loyalist',
        nl: 'De Loyalist',
        fr: 'Le Loyaliste',
        de: 'Der Loyalist',
        es: 'El Leal'
    },
    7: {
        en: 'The Enthusiast',
        nl: 'De Enthousiast',
        fr: 'L\'Enthousiaste',
        de: 'Der Enthusiast',
        es: 'El Entusiasta'
    },
    8: {
        en: 'The Challenger',
        nl: 'De Uitdager',
        fr: 'Le Challenger',
        de: 'Der Herausforderer',
        es: 'El Desafiador'
    },
    9: {
        en: 'The Peacemaker',
        nl: 'De Vredestichter',
        fr: 'Le Pacificateur',
        de: 'Der Friedensstifter',
        es: 'El Pacificador'
    }
};

// Likert scale labels
export const LIKERT_SCALE_LABELS: Record<Locale, Record<AnswerValue, string>> = {
    en: {
        1: 'Strongly Disagree',
        2: 'Disagree',
        3: 'Neutral',
        4: 'Agree',
        5: 'Strongly Agree'
    },
    nl: {
        1: 'Helemaal oneens',
        2: 'Oneens',
        3: 'Neutraal',
        4: 'Eens',
        5: 'Helemaal eens'
    },
    fr: {
        1: 'Pas du tout d\'accord',
        2: 'Pas d\'accord',
        3: 'Neutre',
        4: 'D\'accord',
        5: 'Tout à fait d\'accord'
    },
    de: {
        1: 'Stimme überhaupt nicht zu',
        2: 'Stimme nicht zu',
        3: 'Neutral',
        4: 'Stimme zu',
        5: 'Stimme voll zu'
    },
    es: {
        1: 'Totalmente en desacuerdo',
        2: 'En desacuerdo',
        3: 'Neutral',
        4: 'De acuerdo',
        5: 'Totalmente de acuerdo'
    }
};
