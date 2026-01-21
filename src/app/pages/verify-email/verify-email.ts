import { Component, OnInit, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css'
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  @ViewChildren('digitInput') digitInputs!: QueryList<ElementRef>;

  email: string = '';
  digits: string[] = ['', '', '', '', '', ''];
  isVerifying: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;
  resendCountdown: number = 0;
  private countdownInterval: any;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.email = user.email;

    // If already verified, redirect to dashboard/onboarding
    if (user.email_verified) {
      this.redirectAfter();
      return;
    }
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  /**
   * Handle input in digit fields - DISABLED
   */
  onDigitInput(event: any, index: number): void {
    // Disabled - we handle everything in keydown to prevent glitches
    return;
  }

  /**
   * Handle keydown - this handles ALL input
   */
  onDigitKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    const key = event.key;

    console.log('Keydown:', key, 'at index:', index);

    // Handle backspace
    if (key === 'Backspace') {
      event.preventDefault();
      if (input.value) {
        // Clear current digit
        input.value = '';
        this.digits[index] = '';
      } else if (index > 0) {
        // Move to previous and clear it
        const prevInput = this.digitInputs.toArray()[index - 1];
        if (prevInput) {
          prevInput.nativeElement.value = '';
          this.digits[index - 1] = '';
          prevInput.nativeElement.focus();
        }
      }
      return;
    }

    // Handle arrow keys
    if (key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.digitInputs.toArray()[index - 1].nativeElement.focus();
      return;
    }
    if (key === 'ArrowRight' && index < 5) {
      event.preventDefault();
      this.digitInputs.toArray()[index + 1].nativeElement.focus();
      return;
    }

    // Only allow digits
    if (!/^\d$/.test(key)) {
      event.preventDefault();
      return;
    }

    // Handle digit input
    event.preventDefault();
    input.value = key;
    this.digits[index] = key;
    console.log('Digits:', this.digits);

    // Auto-advance
    if (index < 5) {
      setTimeout(() => {
        this.digitInputs.toArray()[index + 1].nativeElement.focus();
      }, 50);
    } else {
      // Check if complete
      if (this.isCodeComplete()) {
        console.log('Code complete!');
        setTimeout(() => this.verifyCode(), 200);
      }
    }
  }

  /**
   * Handle paste event
   */
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text').trim();

    if (pastedData && /^\d{6}$/.test(pastedData)) {
      // Valid 6-digit code pasted
      for (let i = 0; i < 6; i++) {
        this.digits[i] = pastedData[i];
        const input = this.digitInputs.toArray()[i];
        if (input) {
          input.nativeElement.value = pastedData[i];
        }
      }

      // Focus last input
      const lastInput = this.digitInputs.toArray()[5];
      if (lastInput) {
        lastInput.nativeElement.focus();
      }

      // Auto-submit after paste
      setTimeout(() => this.verifyCode(), 100);
    }
  }

  /**
   * Check if all 6 digits are entered
   */
  isCodeComplete(): boolean {
    return this.digits.every(digit => digit.length === 1);
  }

  /**
   * Get the full 6-digit code
   */
  getCode(): string {
    return this.digits.join('');
  }

  /**
   * Verify the entered code
   */
  async verifyCode(): Promise<void> {
    if (!this.isCodeComplete()) {
      this.error = 'Please enter all 6 digits';
      return;
    }

    this.isVerifying = true;
    this.error = null;
    this.successMessage = null;

    const code = this.getCode();

    this.authService.verifyEmail(code).subscribe({
      next: (response) => {
        this.isVerifying = false;
        this.successMessage = response.message || 'Email verified successfully!';
        this.notificationService.success('Email verified!', 'Success');

        // Redirect after short delay
        setTimeout(() => {
          this.redirectAfter();
        }, 1500);
      },
      error: (error) => {
        this.isVerifying = false;

        if (error.status === 422) {
          this.error = error.error?.error || 'Invalid or expired code';

          // Shake animation on error
          this.shakeInputs();
        } else {
          this.error = 'Unable to verify. Please try again.';
        }

        // Clear digits on error for retry
        this.clearDigits();
      }
    });
  }

  /**
   * Resend verification code
   */
  async resendCode(): Promise<void> {
    if (this.resendCountdown > 0) return;

    this.authService.resendVerification().subscribe({
      next: (response) => {
        this.notificationService.success(response.message || 'Code sent! Check your email.', 'Success');
        this.error = null;

        // Start 60-second countdown
        this.resendCountdown = 60;
        this.startCountdown();
      },
      error: (error) => {
        if (error.status === 429) {
          const retryAfter = error.error?.retry_after || 60;
          this.resendCountdown = retryAfter;
          this.startCountdown();
          this.notificationService.error(`Please wait ${retryAfter} seconds before requesting another code`, 'Rate Limited');
        } else {
          this.notificationService.error('Failed to resend code. Please try again.', 'Error');
        }
      }
    });
  }

  /**
   * Start countdown timer for resend button
   */
  private startCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.countdownInterval = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  /**
   * Clear all digit inputs
   */
  clearDigits(): void {
    this.digits = ['', '', '', '', '', ''];
    this.digitInputs.toArray().forEach((input, index) => {
      input.nativeElement.value = '';
      if (index === 0) {
        input.nativeElement.focus();
      }
    });
  }

  /**
   * Shake inputs on error
   */
  private shakeInputs(): void {
    const container = document.querySelector('.digit-inputs');
    if (container) {
      container.classList.add('shake');
      setTimeout(() => {
        container.classList.remove('shake');
      }, 500);
    }
  }

  /**
   * Redirect after successful verification
   */
  private redirectAfter(): void {
    const user = this.authService.getCurrentUser();

    if (user?.needs_onboarding) {
      this.router.navigate(['/onboarding/welcome']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Go back to registration
   */
  goToRegister(): void {
    this.authService.logout();
    this.router.navigate(['/register']);
  }
}
