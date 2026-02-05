import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CandidateService } from '../../../services/candidate.service';
import { CandidateDetail } from '../../../models/candidate.model';


@Component({
    selector: 'app-candidate-detail',
    standalone: true,
    imports: [
        CommonModule, 
        RouterModule
    ],
    templateUrl: './candidate-detail.component.html',
    styleUrl: './candidate-detail.component.css'
})
export class CandidateDetailComponent implements OnInit, AfterViewInit {
    candidate: CandidateDetail | null = null;
    loading = true;
    error: string | null = null;

    mriData: any = null;
    loadingMRI = true;

    @ViewChild('radarCanvas') radarCanvas?: ElementRef<HTMLCanvasElement>;
    @ViewChild('gaugeCanvas') gaugeCanvas?: ElementRef<HTMLCanvasElement>;
    @ViewChild('focusCanvas') focusCanvas?: ElementRef<HTMLCanvasElement>;
    @ViewChild('sparklineCanvas') sparklineCanvas?: ElementRef<HTMLCanvasElement>;

    constructor(
        private route: ActivatedRoute,
        private candidateService: CandidateService
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

    ngAfterViewInit() {
        // Charts will be rendered after MRI data loads
    }

    loadCandidate(id: string) {
        this.loading = true;
        this.error = null;

        this.candidateService.getCandidate(id).subscribe({
            next: (candidate) => {
                this.candidate = candidate;
                this.loading = false;
                this.loadMRIData(id);
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

    loadMRIData(id: string) {
        this.loadingMRI = true;
        
        this.candidateService.getCandidateMRI(id).subscribe({
            next: (data) => {
                this.mriData = data;
                this.loadingMRI = false;
                
                // Render charts after data is loaded
                setTimeout(() => this.renderCharts(), 100);
            },
            error: (err) => {
                console.error('Error loading MRI data:', err);
                this.loadingMRI = false;
            }
        });
    }

    renderCharts() {
        if (!this.mriData) return;
        
        this.drawRadarChart();
        this.drawGaugeChart();
        this.drawFocusChart();
        this.drawSparkline();
    }

    drawRadarChart() {
        if (!this.radarCanvas || !this.mriData.radar_data) return;
        
        const canvas = this.radarCanvas.nativeElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width = canvas.offsetWidth * 2;
        const height = canvas.height = canvas.offsetHeight * 2;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.35;

        ctx.clearRect(0, 0, width, height);

        const labels = this.mriData.radar_data.labels;
        const candidate = this.mriData.radar_data.candidate;
        const ideal = this.mriData.radar_data.ideal;
        const numSides = labels.length;

        // Draw grid
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        for (let level = 1; level <= 5; level++) {
            ctx.beginPath();
            for (let i = 0; i <= numSides; i++) {
                const angle = (i * 2 * Math.PI) / numSides - Math.PI / 2;
                const r = (radius * level) / 5;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }

        // Draw ideal (outline)
        ctx.beginPath();
        for (let i = 0; i <= numSides; i++) {
            const angle = (i * 2 * Math.PI) / numSides - Math.PI / 2;
            const value = ideal[i % numSides];
            const r = (radius * value) / 100;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw candidate (filled)
        ctx.beginPath();
        for (let i = 0; i <= numSides; i++) {
            const angle = (i * 2 * Math.PI) / numSides - Math.PI / 2;
            const value = candidate[i % numSides];
            const r = (radius * value) / 100;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    drawGaugeChart() {
        if (!this.gaugeCanvas) return;
        
        const canvas = this.gaugeCanvas.nativeElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width = canvas.offsetWidth * 2;
        const height = canvas.height = canvas.offsetHeight * 2;
        const centerX = width / 2;
        const centerY = height * 0.65;
        const radius = Math.min(width, height) * 0.4;

        ctx.clearRect(0, 0, width, height);

        const score = this.mriData.kpis.overall;
        const startAngle = Math.PI;
        const endAngle = 2 * Math.PI;
        const scoreAngle = startAngle + ((endAngle - startAngle) * score) / 100;

        // Background arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 20;
        ctx.stroke();

        // Score arc (gradient)
        const gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
        if (score >= 85) {
            gradient.addColorStop(0, '#10b981');
            gradient.addColorStop(1, '#06b6d4');
        } else if (score >= 70) {
            gradient.addColorStop(0, '#3b82f6');
            gradient.addColorStop(1, '#06b6d4');
        } else {
            gradient.addColorStop(0, '#f59e0b');
            gradient.addColorStop(1, '#ef4444');
        }

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, scoreAngle);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 20;
        ctx.stroke();
    }

    drawFocusChart() {
        if (!this.focusCanvas || !this.mriData.behavioral_mri.focus_timeline) return;
        
        const canvas = this.focusCanvas.nativeElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width = canvas.offsetWidth * 2;
        const height = canvas.height = canvas.offsetHeight * 2;
        const padding = 40;

        ctx.clearRect(0, 0, width, height);

        const timeline = this.mriData.behavioral_mri.focus_timeline;
        const points = timeline.length;
        const stepX = (width - padding * 2) / (points - 1);

        // Draw line
        ctx.beginPath();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;

        timeline.forEach((item: any, i: number) => {
            const x = padding + i * stepX;
            const y = height - padding - (item.focus_quality === 'High' ? height * 0.7 : height * 0.3);
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Draw points
        timeline.forEach((item: any, i: number) => {
            const x = padding + i * stepX;
            const y = height - padding - (item.focus_quality === 'High' ? height * 0.7 : height * 0.3);
            
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, 2 * Math.PI);
            ctx.fillStyle = '#3b82f6';
            ctx.fill();
        });
    }

    drawSparkline() {
        if (!this.sparklineCanvas || !this.mriData.behavioral_mri.focus_timeline) return;
        
        const canvas = this.sparklineCanvas.nativeElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width = canvas.offsetWidth * 2;
        const height = canvas.height = canvas.offsetHeight * 2;

        ctx.clearRect(0, 0, width, height);

        const timeline = this.mriData.behavioral_mri.focus_timeline;
        const durations = timeline.map((t: any) => t.duration_minutes);
        const max = Math.max(...durations);
        const stepX = width / (durations.length - 1);

        // Gradient fill
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

        ctx.beginPath();
        durations.forEach((duration: number, i: number) => {
            const x = i * stepX;
            const y = height - (duration / max) * height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Line
        ctx.beginPath();
        durations.forEach((duration: number, i: number) => {
            const x = i * stepX;
            const y = height - (duration / max) * height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Helper Methods
    getInitials(fullName: string): string {
        const parts = fullName.split(' ');
        if (parts.length >= 2) {
            return parts[0][0] + parts[parts.length - 1][0];
        }
        return parts[0][0] || '?';
    }

    formatStatus(status: string): string {
        return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    formatVerdict(verdict: string): string {
        return verdict.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }

    getVerdictClass(verdict: string): string {
        switch (verdict) {
            case 'STRONG_HIRE':
                return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
            case 'HIRE':
                return 'bg-blue-100 text-blue-800 border border-blue-300';
            case 'MAYBE':
                return 'bg-amber-100 text-amber-800 border border-amber-300';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-300';
        }
    }

}
