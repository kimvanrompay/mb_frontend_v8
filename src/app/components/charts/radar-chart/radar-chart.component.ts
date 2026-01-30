import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-radar-chart',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="relative w-full aspect-square flex items-center justify-center">
      <svg viewBox="-20 -20 140 140" class="w-full h-full overflow-visible">
        <!-- Grid Polygons (Background) -->
        <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="#e5e7eb" stroke-width="1" />
        <polygon points="50,25 75,37.5 75,62.5 50,75 25,62.5 25,37.5" fill="none" stroke="#e5e7eb" stroke-width="1" />
        <polygon points="50,40 60,45 60,55 50,60 40,55 40,45" fill="none" stroke="#e5e7eb" stroke-width="1" />
        
        <!-- Axes -->
        <line x1="50" y1="50" x2="50" y2="10" stroke="#e5e7eb" stroke-width="1" />
        <line x1="50" y1="50" x2="90" y2="30" stroke="#e5e7eb" stroke-width="1" />
        <line x1="50" y1="50" x2="90" y2="70" stroke="#e5e7eb" stroke-width="1" />
        <line x1="50" y1="50" x2="50" y2="90" stroke="#e5e7eb" stroke-width="1" />
        <line x1="50" y1="50" x2="10" y2="70" stroke="#e5e7eb" stroke-width="1" />
        <line x1="50" y1="50" x2="10" y2="30" stroke="#e5e7eb" stroke-width="1" />

        <!-- Data Shape -->
        <polygon [attr.points]="getPoints()" fill="rgba(21, 128, 61, 0.2)" stroke="var(--accent-green-600)" stroke-width="2" class="transition-all duration-1000 ease-out" />
        
        <!-- Plot Points -->
        <circle *ngFor="let p of points" [attr.cx]="p.x" [attr.cy]="p.y" r="2" fill="var(--accent-green-600)" />
        
        <!-- Labels -->
        <text x="50" y="5" text-anchor="middle" class="text-[8px] font-bold fill-gray-500">Technical</text>
        <text x="95" y="28" text-anchor="start" class="text-[8px] font-bold fill-gray-500">Soft Skills</text>
        <text x="95" y="75" text-anchor="start" class="text-[8px] font-bold fill-gray-500">Culture</text>
        <text x="50" y="98" text-anchor="middle" class="text-[8px] font-bold fill-gray-500">Exp.</text>
        <text x="5" y="75" text-anchor="end" class="text-[8px] font-bold fill-gray-500">Edu.</text>
        <text x="5" y="28" text-anchor="end" class="text-[8px] font-bold fill-gray-500">Leadership</text>
      </svg>
    </div>
  `,
    styles: []
})
export class RadarChartComponent implements OnInit {
    @Input() data: number[] = [80, 70, 90, 60, 85, 75]; // Default Mock Data (0-100)

    points: { x: number, y: number }[] = [];

    ngOnInit() {
        this.calculatePoints();
    }

    calculatePoints() {
        // 6 axes, 60 degrees apart
        // Center is 50, 50. Max radius is 40.
        const radius = 40;
        const center = 50;

        this.points = this.data.map((value, index) => {
            const angle = (Math.PI / 3) * index - (Math.PI / 2); // Start at top (-90deg)
            const r = (value / 100) * radius;
            return {
                x: center + r * Math.cos(angle),
                y: center + r * Math.sin(angle)
            };
        });
    }

    getPoints(): string {
        return this.points.map(p => `${p.x},${p.y}`).join(' ');
    }
}
