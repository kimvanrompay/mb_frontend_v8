import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CandidateService } from '../../../services/candidate.service';
import { CandidateDetail } from '../../../models/candidate.model';

interface Archetype {
    name: string;
    keywords: string;
    vibe: string;
    shadow: string; // The "Shadow Side"
}

// The 16 Archetypes Matrix (Primary + Secondary)
const ARCHETYPES: { [key: string]: Archetype } = {
    // Character (C) Driven
    'CC': { name: 'The Pure Idealist', keywords: 'Values, Transparency, Ethics, Non-Profit', vibe: 'A B-Corp where mission is never compromised.', shadow: 'Rigidity, Moral Superiority' },
    'CO': { name: 'The Conscious Innovator', keywords: 'Social Entrep., Purposeful Disruption', vibe: 'Startup solving climate change.', shadow: 'Impracticality, Savior Complex' },
    'CR': { name: 'The Legacy Guardian', keywords: 'Trust, Stability, Family-Owned', vibe: 'Multi-generational family business.', shadow: 'Resistance to Change, Nepotism' },
    'CE': { name: 'The Trusted Standard', keywords: 'Reputation, Quality Assurance', vibe: 'Top-tier law firm or safety certification.', shadow: 'Bureaucracy, Risk Aversion' },

    // Originality (O) Driven
    'OO': { name: 'The Radical Disruptor', keywords: 'Chaos, Moonshots, Novelty', vibe: 'Experimental R&D lab.', shadow: 'Instability, Burnout' },
    'OC': { name: 'The Humanist Creator', keywords: 'Expression, Diversity, Empathy', vibe: 'User-centric design studio.', shadow: 'Subjectivity over Data' },
    'OR': { name: 'The Agile Explorer', keywords: 'Pivot, Experimentation, Adaptability', vibe: 'Venture studio iterating until it works.', shadow: 'Lack of Focus, Directionless' },
    'OE': { name: 'The Precision Designer', keywords: 'Aesthetics, Polish, Sophistication', vibe: 'Luxury fashion or high-end tech.', shadow: 'Form over Function, Elitism' },

    // Resilience (R) Driven
    'RR': { name: 'The Iron Fortress', keywords: 'Survival, Grit, Bootstrapping', vibe: 'Company in turnaround phase.', shadow: 'Defensiveness, Scarcity Mindset' },
    'RC': { name: 'The Servant Leader', keywords: 'Support, Dedication, Patience', vibe: 'Hospital or high-touch hospitality.', shadow: 'Martyrdom, Burnout' },
    'RO': { name: 'The Guerrilla Fighter', keywords: 'Resourcefulness, Hacking, Speed', vibe: 'Underdog startup disrupting monopoly.', shadow: 'Rule-Breaking, Short-Termism' },
    'RE': { name: 'The Reliable Engine', keywords: 'Logistics, Scale, consistency', vibe: 'Infrastructure or utilities company.', shadow: 'Monotony, lack of Innovation' },

    // Excellence (E) Driven
    'EE': { name: 'The Elite Machine', keywords: 'KPIs, Quotas, Perfection', vibe: 'Investment banking or pro sports.', shadow: 'Ruthlessness, Toxic Culture' },
    'EC': { name: 'The Wise Authority', keywords: 'Mentorship, Mastery, Wisdom', vibe: 'University or think tank.', shadow: 'Dogmatism, aloofness' },
    'EO': { name: 'The Market Shark', keywords: 'Strategy, Leverage, Scale-Up', vibe: 'High-growth VC unicorn.', shadow: 'Greed, Ethical Grey Areas' },
    'ER': { name: 'The High-Stakes Player', keywords: 'Pressure, Zero-Error, Execution', vibe: 'Aerospace or surgery unit.', shadow: 'Paralysis by Analysis, Intolerance' }
};

@Component({
    selector: 'app-candidate-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './candidate-detail.component.html',
    styleUrl: './candidate-detail.component.css'
})
export class CandidateDetailComponent implements OnInit {
    candidate: CandidateDetail | null = null;
    loading = true;
    error: string | null = null;

    // C.O.R.E Profile State
    coreProfile = {
        scores: { c: 0, o: 0, r: 0, e: 0 },
        archetype: null as Archetype | null,
        code: ''
    };

    activeTab: 'summary' | 'c' | 'o' | 'r' | 'e' = 'summary';

    // Notes Panel State (Drawer)
    isDrawerOpen = false;
    showNotesPanel = false;
    newNoteContent = '';
    candidateNotes: Array<{ id: string; author: string; content: string; created_at: string }> = [
        // Mock notes - will come from API
        { id: '1', author: 'Kim Van Rompay', content: 'Initial screening completed. Strong technical skills.', created_at: '2024-02-01T10:30:00Z' },
        { id: '2', author: 'Team Lead', content: 'Scheduled for technical interview on Feb 5th.', created_at: '2024-02-02T14:15:00Z' }
    ];

    // Mock evidence data (in real app, this comes from backend details)
    evidenceMap: any = {
        c: [
            { test: 'Ethics & Integrity Scale', score: 'High', date: '2023-10-15', finding: 'Strong alignment with transparent reporting.' },
            { test: 'Culture Fit Interview', score: '9/10', date: '2023-10-18', finding: 'Demonstrated deep empathy for mission.' }
        ],
        o: [
            { test: 'Divergent Thinking Task', score: 'Moderate', date: '2023-10-15', finding: 'Good at generating ideas, focused on practical application.' }
        ],
        r: [
            { test: 'Grit Scale', score: 'Very High', date: '2023-10-15', finding: 'Shows exceptional persistence under pressure.' },
            { test: 'Work Sample', score: 'Pass', date: '2023-10-20', finding: 'Completed task despite ambiguous instructions.' }
        ],
        e: [
            { test: 'Technical Assessment', score: 'Top 5%', date: '2023-10-16', finding: 'Code quality is production-ready.' },
            { test: 'KPI History', score: 'Solid', date: '2023-10-12', finding: 'Consistently met quotas in previous role.' }
        ]
    };

    constructor(
        private route: ActivatedRoute,
        private candidateService: CandidateService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadCandidate(id);
        } else {
            this.loading = false;
            this.error = 'No candidate ID provided.';
        }
    }

    loadCandidate(id: string) {
        this.loading = true;
        this.error = null;

        this.candidateService.getCandidate(id).subscribe({
            next: (candidate) => {
                console.log('✅ API Response received:', candidate);
                console.log('📊 Is candidate defined?', !!candidate);
                console.log('🔑 Fields:', candidate ? Object.keys(candidate) : 'none');

                this.candidate = candidate;
                this.deriveCoreProfile(candidate);
                this.loading = false;
                this.cdr.detectChanges(); // Manually trigger change detection

                console.log('✅ Loading set to false, change detection triggered');
            },
            error: (err) => {
                console.error('Error loading candidate:', err);

                if (err.status === 404) {
                    this.error = 'Candidate not found. This candidate may have been deleted.';
                } else if (err.status === 500) {
                    this.error = 'Server error loading candidate details. The backend team has been notified. Please try again later or contact support.';
                } else if (err.status === 0) {
                    this.error = 'Unable to connect to the server. Please check your internet connection.';
                } else {
                    this.error = `Failed to load candidate details (Error ${err.status || 'Unknown'})`;
                }

                this.loading = false;
            }
        });
    }

    deriveCoreProfile(candidate: CandidateDetail) {
        // Map existing matches to C, O, R, E. If missing, use random/default for demo.
        // Character = Values Match
        // Originality = Potential Match
        // Resilience = Expectation Match (Proxy)
        // Excellence = Skills Match

        // Default to a random solid score if null for demo purposes
        const seed = candidate.id.charCodeAt(0) || 50;

        const c = candidate.values_match ?? (60 + (seed % 30));
        const o = candidate.potential_match ?? (50 + (seed % 40));
        const r = candidate.expectation_match ?? (55 + (seed % 35));
        const e = candidate.skills_match ?? (70 + (seed % 25));

        this.coreProfile.scores = { c, o, r, e };

        // Determine Archetype (Top 2)
        const sorted = [
            { key: 'C', val: c },
            { key: 'O', val: o },
            { key: 'R', val: r },
            { key: 'E', val: e }
        ].sort((a, b) => b.val - a.val);

        const primary = sorted[0].key;
        const secondary = sorted[1].key;
        const code = primary + secondary;

        this.coreProfile.code = code;
        this.coreProfile.archetype = ARCHETYPES[code] || ARCHETYPES['CC'];
    }

    setActiveTab(tab: 'summary' | 'c' | 'o' | 'r' | 'e') {
        this.activeTab = tab;
    }

    toggleNotesPanel() {
        this.showNotesPanel = !this.showNotesPanel;
    }

    openDrawer() {
        this.isDrawerOpen = true;
    }

    closeDrawer() {
        this.isDrawerOpen = false;
    }

    addNote(event: Event) {
        event.preventDefault();
        if (!this.newNoteContent.trim()) return;

        // TODO: API call to POST /api/v1/candidates/:id/notes
        const newNote = {
            id: Date.now().toString(),
            author: 'Current User', // Will come from auth service
            content: this.newNoteContent,
            created_at: new Date().toISOString()
        };

        this.candidateNotes.push(newNote);
        this.newNoteContent = '';

        console.log('📝 Adding note (placeholder):', newNote);
    }

    formatNoteDate(dateStr: string): string {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    }

    archiveCandidate() {
        // TODO: API call to PATCH /api/v1/candidates/:id { status: 'archived' }
        console.log('📦 Archiving candidate (placeholder)');
        alert('Archive candidate - API integration pending');
    }

    rejectCandidate() {
        // TODO: API call to PATCH /api/v1/candidates/:id { status: 'rejected' }
        console.log('✋ Rejecting candidate (placeholder)');
        alert('Reject candidate - API integration pending');
    }

    deleteCandidate() {
        // TODO: API call to DELETE /api/v1/candidates/:id
        const confirmed = confirm('Are you sure you want to permanently delete this candidate? This action cannot be undone.');
        if (confirmed) {
            console.log('🗑️ Deleting candidate (placeholder)');
            alert('Delete candidate - API integration pending');
        }
    }

    // --- Helpers ---
    getStatusBadgeClass(status: string): string {
        switch (status) {
            case 'new': return 'bg-blue-50 text-blue-900 border-blue-100'; // Minimal
            case 'in_process': return 'bg-amber-50 text-amber-900 border-amber-100';
            case 'hired': return 'bg-emerald-50 text-emerald-900 border-emerald-100';
            case 'rejected': return 'bg-red-50 text-red-900 border-red-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    }

    getSourceBadgeClass(source: string): string {
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }

    formatStatus(status: string): string {
        return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    formatSource(source: string): string {
        return source.charAt(0).toUpperCase() + source.slice(1);
    }

    formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    formatEventType(type: string): string {
        return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    hasMetadata(metadata: any): boolean {
        return metadata && Object.keys(metadata).length > 0;
    }
}
