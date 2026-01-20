import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
    RecruiterQuestionsResponse,
    AssessmentSubmission,
    AssessmentResponse,
    RecruiterQuestion,
    EnneagramType
} from '../models/recruiter-assessment.model';

@Injectable({
    providedIn: 'root'
})
export class OnboardingServiceMock {

    private mockQuestions: RecruiterQuestion[] = [
        {
            id: 1,
            enneagram_type: 1,
            content: {
                en: "I prioritize adherence to the established hiring process over making exceptions for unique candidates.",
                nl: "Ik geef prioriteit aan het volgen van het vastgestelde wervingsproces.",
                fr: "Je priorite le respect du processus de recrutement etabli.",
                de: "Ich priorisiere die Einhaltung des festgelegten Einstellungsprozesses.",
                es: "Doy prioridad al cumplimiento del proceso de contratacion establecido."
            }
        },
        ...this.generatePlaceholderQuestions(2, 27)
    ];

    private generatePlaceholderQuestions(start: number, end: number): RecruiterQuestion[] {
        const questions: RecruiterQuestion[] = [];
        for (let i = start; i <= end; i++) {
            const typeNum = Math.ceil(i / 3) as EnneagramType;
            questions.push({
                id: i,
                enneagram_type: typeNum,
                content: {
                    en: `This is question ${i} testing type ${typeNum} characteristics in recruiting.`,
                    nl: `Dit is vraag ${i} die type ${typeNum} kenmerken in recruitment test.`,
                    fr: `Ceci est la question ${i} testant les caracteristiques du type ${typeNum}.`,
                    de: `Dies ist Frage ${i}, die Typ ${typeNum} Eigenschaften im Recruiting testet.`,
                    es: `Esta es la pregunta ${i} probando caracteristicas del tipo ${typeNum}.`
                }
            });
        }
        return questions;
    }

    getRecruiterQuestions(locale: string = 'en'): Observable<RecruiterQuestionsResponse> {
        const response: RecruiterQuestionsResponse = {
            questions: this.mockQuestions,
            locale: locale as any,
            supported_locales: ['en', 'nl', 'fr', 'de', 'es']
        };
        return of(response).pipe(delay(500));
    }

    submitRecruiterAssessment(submission: AssessmentSubmission): Observable<AssessmentResponse> {
        const scores: Record<string, number> = {
            '1': 0, '2': 0, '3': 0, '4': 0, '5': 0,
            '6': 0, '7': 0, '8': 0, '9': 0
        };

        submission.answers.forEach(answer => {
            const question = this.mockQuestions.find(q => q.id === answer.question_id);
            if (question) {
                scores[question.enneagram_type] += answer.value;
            }
        });

        let dominantType: EnneagramType = 1;
        let maxScore = 0;
        Object.entries(scores).forEach(([type, score]) => {
            if (score > maxScore) {
                maxScore = score;
                dominantType = parseInt(type) as EnneagramType;
            }
        });

        const typeNames: Record<string, Record<string, string>> = {
            '1': { en: 'The Reformer', nl: 'De Hervormer', fr: 'Le Reformateur', de: 'Der Reformer', es: 'El Reformador' },
            '2': { en: 'The Helper', nl: 'De Helper', fr: 'L Aidant', de: 'Der Helfer', es: 'El Ayudador' },
            '3': { en: 'The Achiever', nl: 'De Presteerder', fr: 'Le Battant', de: 'Der Macher', es: 'El Triunfador' },
            '4': { en: 'The Individualist', nl: 'De Individualist', fr: 'L Individualiste', de: 'Der Individualist', es: 'El Individualista' },
            '5': { en: 'The Observer', nl: 'De Waarnemer', fr: 'L Observateur', de: 'Der Beobachter', es: 'El Observador' },
            '6': { en: 'The Loyalist', nl: 'De Loyalist', fr: 'Le Loyaliste', de: 'Der Loyalist', es: 'El Leal' },
            '7': { en: 'The Enthusiast', nl: 'De Enthousiast', fr: 'L Enthousiaste', de: 'Der Enthusiast', es: 'El Entusiasta' },
            '8': { en: 'The Challenger', nl: 'De Uitdager', fr: 'Le Challenger', de: 'Der Herausforderer', es: 'El Desafiador' },
            '9': { en: 'The Peacemaker', nl: 'De Vredestichter', fr: 'Le Pacificateur', de: 'Der Friedensstifter', es: 'El Pacificador' }
        };

        const descriptions: Record<string, Record<string, string>> = {
            '1': { en: 'Principled and detail-oriented. You maintain high standards in recruiting.', nl: 'Principieel en detailgericht.', fr: 'Principiel et soucieux du detail.', de: 'Prinzipientreu und detailorientiert.', es: 'Principista y orientado a los detalles.' },
            '2': { en: 'Warm and supportive. You build strong relationships with candidates.', nl: 'Warm en ondersteunend.', fr: 'Chaleureux et solidaire.', de: 'Warm und unterstutzend.', es: 'Calido y solidario.' },
            '3': { en: 'Results-driven and ambitious. You excel at closing top talent.', nl: 'Resultaatgericht en ambitieus.', fr: 'Axe sur les resultats et ambitieux.', de: 'Ergebnisorientiert und ehrgeizig.', es: 'Orientado a resultados y ambicioso.' },
            '4': { en: 'Creative and authentic. You find unique candidates others miss.', nl: 'Creatief en authentiek.', fr: 'Creatif et authentique.', de: 'Kreativ und authentisch.', es: 'Creativo y autentico.' },
            '5': { en: 'Analytical and strategic. You make data-driven hiring decisions.', nl: 'Analytisch en strategisch.', fr: 'Analytique et strategique.', de: 'Analytisch und strategisch.', es: 'Analitico y estrategico.' },
            '6': { en: 'Loyal and thorough. You ensure candidates are the right cultural fit.', nl: 'Loyaal en grondig.', fr: 'Loyal et minutieux.', de: 'Loyal und grundlich.', es: 'Leal y minucioso.' },
            '7': { en: 'Energetic and innovative. You bring enthusiasm to every search.', nl: 'Energiek en innovatief.', fr: 'Energique et innovant.', de: 'Energisch und innovativ.', es: 'Energico e innovador.' },
            '8': { en: 'Direct and assertive. You lead the hiring process with confidence.', nl: 'Direct en assertief.', fr: 'Direct et affirme.', de: 'Direkt und durchsetzungsfahig.', es: 'Directo y asertivo.' },
            '9': { en: 'Patient and diplomatic. You create harmonious hiring experiences.', nl: 'Geduldig en diplomatiek.', fr: 'Patient et diplomatique.', de: 'Geduldig und diplomatisch.', es: 'Paciente y diplomatico.' }
        };

        const response: AssessmentResponse = {
            message: 'Assessment completed successfully!',
            result: {
                assessment_id: Math.floor(Math.random() * 1000),
                dominant_type: dominantType,
                type_name: typeNames[dominantType][submission.locale],
                type_description: descriptions[dominantType][submission.locale],
                locale: submission.locale,
                all_scores: scores as any
            }
        };

        return of(response).pipe(delay(1000));
    }

    validateAnswers(answers: any[]): { valid: boolean; errors: string[] } {
        const errors: string[] = [];
        if (answers.length !== 27) {
            errors.push(`All 27 questions must be answered. Currently answered: ${answers.length}`);
        }
        return { valid: errors.length === 0, errors };
    }

    isComplete(answers: any[]): boolean {
        return answers.length === 27;
    }

    getProgress(answers: any[]): number {
        return Math.round((answers.length / 27) * 100);
    }

    getAnswerForQuestion(answers: any[], questionId: number): any {
        const answer = answers.find((a: any) => a.question_id === questionId);
        return answer ? answer.value : null;
    }
}
