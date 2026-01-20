import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-onboarding-welcome',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './welcome.component.html',
    styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
    constructor(private router: Router) { }

    startAssessment(): void {
        this.router.navigate(['/onboarding/assessment']);
    }
}
