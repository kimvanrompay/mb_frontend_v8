import { Component, ChangeDetectorRef } from '@angular/core';
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
  errorMessage = '';
  errors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    // Clear previous notifications and errors
    this.notificationService.clear();
    this.errorMessage = '';
    this.errors = [];

    // Validate form
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.notificationService.error(
        'Please fill in all required fields correctly.',
        'Form Validation Error'
      );
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges(); // Force update loading state

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.errorMessage = '';
        this.errors = [];
        this.isLoading = false;
        this.cdr.detectChanges(); // Force UI update

        this.notificationService.success(
          'You have successfully logged in. Redirecting...',
          'Login Successful'
        );

        // Small delay to show success message before redirect
        setTimeout(() => {
          // Check if user needs onboarding
          if (response.user.needs_onboarding) {
            this.router.navigate(['/onboarding']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }, 500);
      },
      error: (error) => {
        const authError = this.authService.handleAuthError(error, 'login');

        // Set inline error message
        this.errorMessage = authError.title;

        // Parse errors array if available
        this.errors = this.parseErrors(error);

        // Reset loading state FIRST
        this.isLoading = false;

        // Force change detection to update UI immediately
        this.cdr.detectChanges();

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

  /**
   * Parse errors from API response
   */
  private parseErrors(error: any): string[] {
    const errors: string[] = [];

    // Check for error.error directly (like "Invalid email or password")
    if (error?.error?.error) {
      if (typeof error.error.error === 'string') {
        errors.push(error.error.error);
      } else if (Array.isArray(error.error.error)) {
        errors.push(...error.error.error);
      }
    }

    // Check for errors object with field-specific errors
    if (error?.error?.errors && typeof error.error.errors === 'object') {
      Object.values(error.error.errors).forEach((fieldErrors: any) => {
        if (Array.isArray(fieldErrors)) {
          errors.push(...fieldErrors);
        } else if (typeof fieldErrors === 'string') {
          errors.push(fieldErrors);
        }
      });
    }

    // Check for message field
    if (error?.error?.message && typeof error.error.message === 'string') {
      errors.push(error.error.message);
    }

    // If no errors found, add a default message
    if (errors.length === 0 && error?.message) {
      errors.push(error.message);
    }

    return errors;
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
