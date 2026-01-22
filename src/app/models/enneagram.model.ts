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

// Enneagram type definitions with recruitment-specific names
export const ENNEAGRAM_TYPES: EnneagramType[] = [
    {
        id: '1',
        name: 'The Quality Controller',
        code: 'Q',
        emoji: '✓',
        color: '#2E7D32',
        description: 'Principled, structured, and detail-oriented. Prioritizes process adherence and precision.',
        coreMotivation: [
            'To maintain high standards and quality',
            'To improve processes and avoid mistakes',
            'To ensure integrity in hiring'
        ],
        keyTraits: [
            'Exceptional attention to detail',
            'Strong ethical standards',
            'Process-oriented and systematic'
        ],
        atTheirBest: 'Creates fair, excellent hiring processes with consistent quality and integrity.'
    },
    {
        id: '2',
        name: 'The Connector',
        code: 'C',
        emoji: '🤝',
        color: '#E91E63',
        description: 'Relationship-focused, empathetic, and supportive. Values building connections.',
        coreMotivation: [
            'To be valued and appreciated',
            'To help candidates and hiring managers succeed',
            'To build meaningful relationships'
        ],
        keyTraits: [
            'Warm and personable',
            'Excellent at building rapport',
            'Naturally supportive and caring'
        ],
        atTheirBest: 'Creates exceptional candidate experiences through genuine care and connection.'
    },
    {
        id: '3',
        name: 'The Driver',
        code: 'D',
        emoji: '🎯',
        color: '#FFC107',
        description: 'Goal-driven, efficient, and adaptable. Measures success by results.',
        coreMotivation: [
            'To achieve targets and be successful',
            'To be recognized for accomplishments',
            'To deliver exceptional results'
        ],
        keyTraits: [
            'Highly efficient and results-focused',
            'Adaptable and professional',
            'Driven to exceed expectations'
        ],
        atTheirBest: 'Delivers outstanding results while maintaining authentic connections and quality.'
    },
    {
        id: '4',
        name: 'The Innovator',
        code: 'I',
        emoji: '🎨',
        color: '#9C27B0',
        description: 'Creative, authentic, and depth-seeking. Drawn to unique talent.',
        coreMotivation: [
            'To find and develop unique talent',
            'To create meaningful hiring experiences',
            'To maintain authenticity and depth'
        ],
        keyTraits: [
            'Creative and insightful',
            'Values authenticity and cultural fit',
            'Thinks outside the box'
        ],
        atTheirBest: 'Discovers exceptional talent others miss through creative and authentic engagement.'
    },
    {
        id: '5',
        name: 'The Specialist',
        code: 'S',
        emoji: '🔍',
        color: '#1565C0',
        description: 'Analytical, independent, and data-driven. Prefers thorough research.',
        coreMotivation: [
            'To possess deep knowledge and expertise',
            'To make objective, data-driven decisions',
            'To be competent and capable'
        ],
        keyTraits: [
            'Highly analytical and objective',
            'Expert in specialized domains',
            'Thorough and methodical'
        ],
        atTheirBest: 'Makes exceptional hiring decisions through deep expertise and objective analysis.'
    },
    {
        id: '6',
        name: "The Devil's Advocate",
        code: 'A',
        emoji: '🛡️',
        color: '#5D4037',
        description: 'Cautious, thorough, and team-oriented. Prioritizes risk mitigation.',
        coreMotivation: [
            'To ensure security and minimize risks',
            'To build reliable, trustworthy teams',
            'To maintain stability and support'
        ],
        keyTraits: [
            'Thorough and diligent',
            'Identifies risks and red flags',
            'Loyal and committed'
        ],
        atTheirBest: 'Creates secure, reliable teams through comprehensive vetting and risk awareness.'
    },
    {
        id: '7',
        name: 'The Visionary',
        code: 'V',
        emoji: '✨',
        color: '#FF9800',
        description: 'Energetic, versatile, and forward-thinking. Thrives on variety.',
        coreMotivation: [
            'To explore opportunities and possibilities',
            'To keep work engaging and dynamic',
            'To sell the vision and excite candidates'
        ],
        keyTraits: [
            'Enthusiastic and optimistic',
            'Excellent at selling opportunities',
            'Handles multiple priorities well'
        ],
        atTheirBest: 'Inspires candidates with vision while maintaining focus on delivering results.'
    },
    {
        id: '8',
        name: 'The Leader',
        code: 'L',
        emoji: '💪',
        color: '#C62828',
        description: 'Direct, assertive, and leadership-oriented. Comfortable challenging requirements.',
        coreMotivation: [
            'To be in control and independent',
            'To drive results and make impact',
            'To protect their team and candidates'
        ],
        keyTraits: [
            'Direct and confident',
            'Strong negotiator',
            'Natural leader'
        ],
        atTheirBest: 'Leads hiring processes with confidence while showing care for people and fairness.'
    },
    {
        id: '9',
        name: 'The Mediator',
        code: 'M',
        emoji: '🕊️',
        color: '#00897B',
        description: 'Diplomatic, patient, and harmony-seeking. Excels at mediation.',
        coreMotivation: [
            'To create harmony and balance',
            'To avoid conflict and maintain peace',
            'To facilitate smooth processes'
        ],
        keyTraits: [
            'Patient and diplomatic',
            'Excellent listener',
            'Creates inclusive environments'
        ],
        atTheirBest: 'Facilitates harmonious hiring processes while asserting needs and making timely decisions.'
    }
];
