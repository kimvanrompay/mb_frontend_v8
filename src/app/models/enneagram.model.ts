export interface EnneagramType {
    id: string;
    name: string;
    code: string;
    description: string;
    coreMotivation: string[];
    keyTraits: string[];
    atTheirBest: string;
    emoji: string;
    color: string;
}

export interface PriorityOrder {
    [typeId: string]: number; // { "1": 5, "2": 2, ... }
}

export interface OnboardingStatus {
    onboarding_completed: boolean;
    needs_onboarding: boolean;
    enneagram_priority_order: PriorityOrder | null;
    enneagram_priority_code: string | null;
    enneagram_types: { [key: string]: { name: string; code: string } };
}

export interface AssessmentSubmission {
    priority_order: PriorityOrder;
}

export interface AssessmentResponse {
    message: string;
    user: {
        id: number;
        onboarding_completed: boolean;
        enneagram_priority_order: PriorityOrder;
        enneagram_priority_code: string;
    };
}

export interface ApiError {
    error: string;
    field?: string;
    duplicate_ranks?: number[];
    missing_ranks?: number[];
    invalid_type?: string;
    provided_types?: string[];
    expected_types?: string[];
}

// Enneagram type definitions with full details
export const ENNEAGRAM_TYPES: EnneagramType[] = [
    {
        id: '1',
        name: 'The Reformer',
        code: 'R',
        emoji: '⚖️',
        color: '#DC2626',
        description: 'Principled, purposeful, self-controlled, and perfectionistic',
        coreMotivation: [
            'To be good, balanced, and right',
            'To improve things and avoid mistakes',
            'To maintain integrity'
        ],
        keyTraits: [
            'Rational and idealistic',
            'Strong sense of right and wrong',
            'Teachers, crusaders, advocates for change'
        ],
        atTheirBest: 'Wise, discerning, realistic, and noble. Can be morally heroic.'
    },
    {
        id: '2',
        name: 'The Helper',
        code: 'H',
        emoji: '❤️',
        color: '#DC2626',
        description: 'Generous, demonstrative, people-pleasing, and possessive',
        coreMotivation: [
            'To be loved and appreciated',
            'To express their feelings for others',
            'To be needed'
        ],
        keyTraits: [
            'Caring, generous, and supportive',
            'Warm, friendly, and empathetic',
            'Can be sentimental and flattering'
        ],
        atTheirBest: 'Unselfish and altruistic with unconditional love for others.'
    },
    {
        id: '3',
        name: 'The Achiever',
        code: 'A',
        emoji: '🎯',
        color: '#2563EB',
        description: 'Success-oriented, pragmatic, adaptive, and image-conscious',
        coreMotivation: [
            'To feel valuable and worthwhile',
            'To be affirmed and admired',
            'To distinguish themselves from others'
        ],
        keyTraits: [
            'Self-assured, attractive, and charming',
            'Ambitious, competent, and energetic',
            'Status-conscious and driven for advancement'
        ],
        atTheirBest: 'Self-accepting, authentic, and inspiring role models.'
    },
    {
        id: '4',
        name: 'The Individualist',
        code: 'I',
        emoji: '🎨',
        color: '#7C3AED',
        description: 'Expressive, dramatic, self-absorbed, and temperamental',
        coreMotivation: [
            'To express themselves and their individuality',
            'To create and surround themselves with beauty',
            'To maintain certain moods and feelings'
        ],
        keyTraits: [
            'Self-aware, sensitive, and reserved',
            'Emotionally honest and creative',
            'Can be moody and self-conscious'
        ],
        atTheirBest: 'Inspired and highly creative, able to renew themselves and transform their experiences.'
    },
    {
        id: '5',
        name: 'The Investigator',
        code: 'O',
        emoji: '🔍',
        color: '#059669',
        description: 'Perceptive, innovative, secretive, and isolated',
        coreMotivation: [
            'To possess knowledge and understand the environment',
            'To defend themselves from external intrusion',
            'To be capable and competent'
        ],
        keyTraits: [
            'Alert, insightful, and curious',
            'Independent, innovative, and inventive',
            'Can become preoccupied with their thoughts'
        ],
        atTheirBest: 'Visionary pioneers, often ahead of their time, and able to see the world in an entirely new way.'
    },
    {
        id: '6',
        name: 'The Loyalist',
        code: 'L',
        emoji: '🛡️',
        color: '#0891B2',
        description: 'Engaging, responsible, anxious, and suspicious',
        coreMotivation: [
            'To have security and support',
            'To test the attitudes of others toward them',
            'To fight against anxiety and insecurity'
        ],
        keyTraits: [
            'Committed, security-oriented, and reliable',
            'Hard-working, responsible, and trustworthy',
            'Can be defensive and anxious'
        ],
        atTheirBest: 'Internally stable and self-reliant, courageously championing themselves and others.'
    },
    {
        id: '7',
        name: 'The Enthusiast',
        code: 'E',
        emoji: '✨',
        color: '#F59E0B',
        description: 'Spontaneous, versatile, acquisitive, and scattered',
        coreMotivation: [
            'To be satisfied and content',
            'To have their needs fulfilled',
            'To avoid being deprived or in pain'
        ],
        keyTraits: [
            'Extroverted, optimistic, and spontaneous',
            'Playful, high-spirited, and practical',
            'Can be undisciplined and impulsive'
        ],
        atTheirBest: 'Joyous, highly accomplished, and grateful, appreciating life with wonder and delight.'
    },
    {
        id: '8',
        name: 'The Challenger',
        code: 'C',
        emoji: '💪',
        color: '#DC2626',
        description: 'Self-confident, decisive, willful, and confrontational',
        coreMotivation: [
            'To be independent and in control',
            'To protect themselves and those they care about',
            'To prove their strength and resist weakness'
        ],
        keyTraits: [
            'Strong, assertive, and resourceful',
            'Decisive, authoritative, and protective',
            'Can be dominating and intimidating'
        ],
        atTheirBest: 'Self-mastering, using their strength to improve others\' lives, becoming heroic and inspiring.'
    },
    {
        id: '9',
        name: 'The Peacemaker',
        code: 'P',
        emoji: '🕊️',
        color: '#10B981',
        description: 'Receptive, reassuring, complacent, and resigned',
        coreMotivation: [
            'To create harmony in their environment',
            'To avoid conflict and tension',
            'To preserve things as they are'
        ],
        keyTraits: [
            'Accepting, trusting, and stable',
            'Creative, supportive, and easygoing',
            'Can be too willing to go along with others'
        ],
        atTheirBest: 'Indomitable and all-embracing, able to bring people together and heal conflicts.'
    }
];
