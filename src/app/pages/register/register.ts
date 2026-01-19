import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('password_confirmation');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    // Clear previous notifications
    this.notificationService.clear();

    // Validate form
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);

      // Check for password mismatch specifically
      if (this.registerForm.errors?.['passwordMismatch']) {
        this.notificationService.error(
          'The passwords you entered do not match. Please make sure both password fields are identical.',
          'Password Mismatch'
        );
      } else {
        this.notificationService.error(
          'Please fill in all required fields correctly.',
          'Form Validation Error'
        );
      }
      return;
    }

    this.isLoading = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.notificationService.success(
          'Your account has been created successfully! Welcome to Meribas. Redirecting to dashboard...',
          'Registration Successful'
        );
        // Small delay to show success message before redirect
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (error) => {
        this.isLoading = false;
        const authError = this.authService.handleAuthError(error, 'register');

        // Show error notification with appropriate type
        if (authError.type === 'network') {
          this.notificationService.error(authError.message, authError.title);
        } else if (authError.type === 'validation') {
          // For validation errors like "email already exists"
          this.notificationService.warning(authError.message, authError.title);
        } else if (authError.type === 'auth') {
          this.notificationService.error(authError.message, authError.title);
        } else {
          this.notificationService.error(authError.message, authError.title);
        }

        // Log error for debugging (remove in production)
        console.error('Registration error:', error, authError);
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
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get password_confirmation() {
    return this.registerForm.get('password_confirmation');
  }
}
