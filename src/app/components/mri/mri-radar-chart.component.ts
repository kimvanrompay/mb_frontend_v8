import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RadarData {
  labels: string[];
  candidate: number[];
  ideal: number[];
}

@Component({
  selector: 'app-mri-radar-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full" [style.height.px]="height">
      <svg [attr.width]="width" [attr.height]="height" [attr.viewBox]="'0 0 ' + width + ' ' + height">
        <!-- Grid circles -->
        <g [attr.transform]="'translate(' + centerX + ',' + centerY + ')'">
          <circle *ngFor="let level of [0.2, 0.4, 0.6, 0.8, 1.0]"
            [attr.r]="radius * level"
            fill="none"
            stroke="#E5E7EB"
            stroke-width="1"
          />
          
          <!-- Axis lines -->
          <line *ngFor="let point of axisPoints; let i = index"
            [attr.x1]="0"
            [attr.y1]="0"
            [attr.x2]="point.x"
            [attr.y2]="point.y"
            stroke="#E5E7EB"
            stroke-width="1"
          />

          <!-- Ideal Shape (Blue Outline) -->
          <polygon
            [attr.points]="idealPolygonPoints"
            fill="rgba(59, 130, 246, 0.1)"
            stroke="#3B82F6"
            stroke-width="2"
            stroke-dasharray="5,5"
          />

          <!-- Candidate Shape (Filled Green) -->
          <polygon
            [attr.points]="candidatePolygonPoints"
            fill="rgba(16, 185, 129, 0.3)"
            stroke="#10B981"
            stroke-width="3"
            class="transition-all duration-1000 ease-out"
          />

          <!-- Data points (dots) -->
          <circle *ngFor="let point of candidateDataPoints"
            [attr.cx]="point.x"
            [attr.cy]="point.y"
            r="5"
            fill="#10B981"
            stroke="white"
            stroke-width="2"
          />
        </g>

        <!-- Labels -->
        <text *ngFor="let label of labelPositions; let i = index"
          [attr.x]="label.x"
          [attr.y]="label.y"
          text-anchor="middle"
          class="text-sm font-semibold fill-gray-700"
        >
          {{ data?.labels?.[i] }}
        </text>
      </svg>

      <!-- Legend -->
      <div class="flex items-center justify-center gap-6 mt-4">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-emerald-500 opacity-50 border-2 border-emerald-500"></div>
          <span class="text-xs text-gray-600">Candidate</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 border-2 border-blue-500 border-dashed"></div>
          <span class="text-xs text-gray-600">Role Ideal</span>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MriRadarChartComponent implements OnChanges {
  @Input() data: RadarData | null = null;
  @Input() width: number = 400;
  @Input() height: number = 400;

  centerX = 0;
  centerY = 0;
  radius = 0;
  axisPoints: { x: number; y: number }[] = [];
  candidatePolygonPoints = '';
  idealPolygonPoints = '';
  candidateDataPoints: { x: number; y: number }[] = [];
  labelPositions: { x: number; y: number }[] = [];

  ngOnChanges() {
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.radius = Math.min(this.width, this.height) / 2 - 60;

    if (this.data) {
      this.calculatePoints();
    }
  }

  calculatePoints() {
    if (!this.data) return;

    const numAxes = this.data.labels.length;
    const angleStep = (Math.PI * 2) / numAxes;

    // Calculate axis end points
    this.axisPoints = [];
    for (let i = 0; i < numAxes; i++) {
      const angle = angleStep * i - Math.PI / 2; // Start from top
      this.axisPoints.push({
        x: Math.cos(angle) * this.radius,
        y: Math.sin(angle) * this.radius
      });
    }

    // Calculate candidate polygon points
    const candidatePoints: { x: number; y: number }[] = [];
    for (let i = 0; i < numAxes; i++) {
      const value = this.data.candidate[i] || 0;
      const angle = angleStep * i - Math.PI / 2;
      const distance = (value / 100) * this.radius;
      candidatePoints.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      });
    }
    this.candidateDataPoints = candidatePoints;
    this.candidatePolygonPoints = candidatePoints.map(p => `${p.x},${p.y}`).join(' ');

    // Calculate ideal polygon points
    const idealPoints: { x: number; y: number }[] = [];
    for (let i = 0; i < numAxes; i++) {
      const value = this.data.ideal[i] || 75;
      const angle = angleStep * i - Math.PI / 2;
      const distance = (value / 100) * this.radius;
      idealPoints.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      });
    }
    this.idealPolygonPoints = idealPoints.map(p => `${p.x},${p.y}`).join(' ');

    // Calculate label positions (outside the chart)
    this.labelPositions = [];
    for (let i = 0; i < numAxes; i++) {
      const angle = angleStep * i - Math.PI / 2;
      const labelDistance = this.radius + 40;
      this.labelPositions.push({
        x: this.centerX + Math.cos(angle) * labelDistance,
        y: this.centerY + Math.sin(angle) * labelDistance + 5 // Offset for text alignment
      });
    }
  }
}
