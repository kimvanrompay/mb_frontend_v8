import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ColorUtils } from '../../../utils/color.utils';

interface InvitationData {
  valid: boolean;
  candidate: {
    first_name: string;
    last_name: string;
    email: string;
  };
  job: {
    id: string;
    title: string;
    description: string;
  };
  company: {
    name: string;
    color?: string;
    logo?: string;
  };
  error?: string;
}

@Component({
  selector: 'app-candidate-invitation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './candidate-invitation.component.html',
  styleUrls: ['./candidate-invitation.component.css']
})
export class CandidateInvitationComponent implements OnInit {
  token: string = '';
  invitation: InvitationData | null = null;
  loading = true;
  error: string | null = null;
  accepting = false;
  
  // Legal consent
  acceptInvitation = false;
  acceptPrivacyPolicy = false;
  
  // Brand colors
  brandColor: string = '#064E3B'; // Default emerald-900
  textColor: string = '#FFFFFF';
  validationError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    
    if (!this.token) {
      this.error = 'No invitation token provided';
      this.loading = false;
      return;
    }

    this.loadInvitation();
  }

  loadInvitation() {
    this.loading = true;
    this.error = null;

    this.http.get<InvitationData>(`${environment.apiUrl}/candidates/invitation/${this.token}`)
      .subscribe({
        next: (data) => {
          if (data.valid) {
            this.invitation = data;
            // Set dynamic brand colors
            this.setBrandColors();
          } else {
            this.error = data.error || 'Invalid invitation';
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading invitation:', err);
          
          if (err.status === 404) {
            this.error = 'This invitation link is invalid or has been removed.';
          } else if (err.status === 410) {
            this.error = err.error?.error || 'This invitation has expired or has already been accepted.';
          } else {
            this.error = 'Unable to load invitation. Please try again or contact support.';
          }
          
          this.loading = false;
        }
      });
  }

  setBrandColors() {
    if (this.invitation?.company.color) {
      const companyColor = this.invitation.company.color;
      
      // Validate hex color
      if (ColorUtils.isValidHex(companyColor)) {
        this.brandColor = companyColor;
        this.textColor = ColorUtils.getContrastingTextColor(companyColor);
        
        console.log(`🎨 Brand Colors Set:`);
        console.log(`   Background: ${this.brandColor}`);
        console.log(`   Text: ${this.textColor}`);
        console.log(`   Contrast Ratio: ${ColorUtils.getContrastRatio(this.brandColor, this.textColor).toFixed(2)}:1`);
      }
    }
  }

  getLightBrandColor(): string {
    // Return a 12% opacity version for icon backgrounds
    return ColorUtils.lighten(this.brandColor, 85);
  }

  startAssessment() {
    // Validate both consents
    if (!this.acceptInvitation) {
      this.validationError = 'You must accept the invitation to proceed.';
      return;
    }
    
    if (!this.acceptPrivacyPolicy) {
      this.validationError = 'You must accept the Privacy Policy & GDPR Terms to proceed.';
      return;
    }
    
    this.validationError = null;
    this.acceptInvitationBackend();
  }

  acceptInvitationBackend() {
    if (!this.token || this.accepting) return;

    this.accepting = true;

    this.http.post<{ success: boolean; candidate_id: string; message: string }>(
      `${environment.apiUrl}/candidates/invitation/${this.token}/accept`,
      {
        privacy_accepted: true,
        gdpr_accepted: true,
        privacy_accepted_at: new Date().toISOString(),
        gdpr_accepted_at: new Date().toISOString()
      }
    ).subscribe({
      next: (response) => {
        console.log('✅ Invitation accepted:', response);
        
        // Redirect to assessment (universal route)
        if (response.assessment_token) {
          this.router.navigate(['/assessment', response.assessment_token]);
        } else {
          alert('✅ Invitation accepted! However, no assessment was found. Please contact support.');
        }
      },
      error: (err) => {
        console.error('❌ Error accepting invitation:', err);
        this.validationError = err.error?.error || 'Failed to accept invitation. Please try again.';
        this.accepting = false;
      }
    });
  }

  declineInvitation() {
    if (confirm('Are you sure you want to decline this invitation? This action cannot be undone.')) {
      // TODO: Implement decline endpoint if needed
      alert('Thank you for your response. The invitation has been declined.');
      // Could redirect to a thank you page or close window
    }
  }
}
