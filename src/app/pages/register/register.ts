import { Component, ChangeDetectorRef } from '@angular/core';
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
  errorMessage = '';
  errors: string[] = [];
  currentStep = 1; // Track current step (1 or 2)

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.registerForm = this.fb.group({
      tenant_name: ['', [Validators.required]],
      tenant_subdomain: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern(/^[a-z0-9-]+$/)
      ]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]],
      termsAgreed: [false, [Validators.requiredTrue]]
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
    // Clear previous notifications and errors
    this.notificationService.clear();
    this.errorMessage = '';
    this.errors = [];

    // Validate form
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);

      // Check for password mismatch specifically
      if (this.registerForm.errors?.['passwordMismatch']) {
        this.errorMessage = 'Password Mismatch';
        this.errors = ['The passwords you entered do not match. Please make sure both password fields are identical.'];
        this.notificationService.error(
          'The passwords you entered do not match. Please make sure both password fields are identical.',
          'Password Mismatch'
        );
      } else {
        this.errorMessage = 'Form Validation Error';
        this.errors = ['Please fill in all required fields correctly.'];
        this.notificationService.error(
          'Please fill in all required fields correctly.',
          'Form Validation Error'
        );
      }
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges(); // Force update loading state

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.errorMessage = '';
        this.errors = [];
        this.isLoading = false;
        this.cdr.detectChanges(); // Force UI update

        this.notificationService.success(
          response.message || 'Registration successful! Please check your email to verify your account.',
          'Registration Successful'
        );

        // Small delay to show success message before redirect
        setTimeout(() => {
          // Redirect to email verification page
          this.router.navigate(['/verify-email']);
        }, 1000);
      },
      error: (error) => {
        const authError = this.authService.handleAuthError(error, 'register');

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
   * Move to next step
   */
  nextStep(): void {
    // Clear errors
    this.errorMessage = '';
    this.errors = [];
    this.notificationService.clear();

    // Validate step 1 fields
    if (this.currentStep === 1) {
      const step1Fields = ['tenant_name', 'tenant_subdomain'];
      let isValid = true;

      step1Fields.forEach(field => {
        const control = this.registerForm.get(field);
        control?.markAsTouched();
        if (control?.invalid) {
          isValid = false;
        }
      });

      if (!isValid) {
        this.errorMessage = 'Please complete all fields';
        this.errors = ['Please fill in your company name and choose a workspace URL.'];
        this.notificationService.error(
          'Please fill in your company name and choose a workspace URL.',
          'Please complete all fields'
        );
        return;
      }

      this.currentStep = 2;
    }
  }

  /**
   * Move to previous step
   */
  previousStep(): void {
    this.errorMessage = '';
    this.errors = [];
    this.notificationService.clear();

    if (this.currentStep > 1) {
      this.currentStep = 1;
    }
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

  get tenant_name() {
    return this.registerForm.get('tenant_name');
  }

  get tenant_subdomain() {
    return this.registerForm.get('tenant_subdomain');
  }

  get first_name() {
    return this.registerForm.get('first_name');
  }

  get last_name() {
    return this.registerForm.get('last_name');
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

  get termsAgreed() {
    return this.registerForm.get('termsAgreed');
  }
}
