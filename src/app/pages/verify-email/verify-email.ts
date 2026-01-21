import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify-email.html',
  styleUrls: ['./verify-email.css']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  isVerifying = false;
  success = false;
  error: string | null = null;
  showCheckEmail = false;
  email = '';

  private subscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Get user info for display
    const user = this.authService.getCurrentUser();
    if (user) {
      this.email = user.email;
    }

    // Get token from URL query parameter
    const token = this.route.snapshot.queryParams['token'];

    if (!token) {
      // No token = user came from registration, show "check email" screen
      this.showCheckEmail = true;
      return;
    }

    // Has token = user clicked email link, auto-verify
    this.isVerifying = true;
    this.verifyEmail(token);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private verifyEmail(token: string): void {
    console.log('🔑 Verifying email with token...');

    this.subscription = this.authService.verifyEmail(token).subscribe({
      next: (response) => {
        console.log('✅ Email verified successfully!', response);
        this.isVerifying = false;
        this.success = true;

        // Redirect to onboarding after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/onboarding']);
        }, 2000);
      },
      error: (err) => {
        console.error('❌ Verification failed:', err);
        const errorMessage = err.error?.error || err.error?.message || 'Verification failed. The link may be invalid or expired.';
        this.showError(errorMessage);
      }
    });
  }

  private showError(message: string): void {
    this.isVerifying = false;
    this.error = message;
    this.showCheckEmail = false;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  resendVerification(): void {
    this.isVerifying = true;
    this.error = null;
    this.showCheckEmail = false;

    this.subscription = this.authService.resendVerification().subscribe({
      next: (response) => {
        console.log('✅ Verification email resent!', response);
        this.isVerifying = false;
        this.showCheckEmail = true;
      },
      error: (err) => {
        console.error('❌ Resend failed:', err);
        const errorMessage = err.error?.error || err.error?.message || 'Failed to resend verification email.';
        this.showError(errorMessage);
      }
    });
  }
}
