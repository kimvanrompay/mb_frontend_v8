import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    // Clear previous notifications
    this.notificationService.clear();

    // Validate form
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      this.notificationService.error(
        'Please fill in all required fields correctly.',
        'Form Validation Error'
      );
      return;
    }

    this.isLoading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.notificationService.success(
          'You have successfully logged in. Redirecting to dashboard...',
          'Login Successful'
        );
        // Small delay to show success message before redirect
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 500);
      },
      error: (error) => {
        this.isLoading = false;
        const authError = this.authService.handleAuthError(error, 'login');

        // Show error notification with appropriate type
        if (authError.type === 'network') {
          this.notificationService.error(authError.message, authError.title);
        } else if (authError.type === 'validation' || authError.type === 'auth') {
          this.notificationService.warning(authError.message, authError.title);
        } else {
          this.notificationService.error(authError.message, authError.title);
        }

        // Log error for debugging (remove in production)
        console.error('Login error:', error, authError);
      }
    });
  }

  /**
   * Mark all fields in a form group as touched to trigger validation messages
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
