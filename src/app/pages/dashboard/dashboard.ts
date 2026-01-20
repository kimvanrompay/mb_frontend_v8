import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TrialBannerComponent } from '../../components/trial-banner/trial-banner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, TrialBannerComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  constructor() { }
}
