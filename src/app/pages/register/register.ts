import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification';
import { LanguageSwitcherComponent } from '../../components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatStepperModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    LanguageSwitcherComponent
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  // Separate form groups for stepper
  companyForm: FormGroup;
  personalForm: FormGroup;
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
    // Step 1: Company information
    this.companyForm = this.fb.group({
      tenant_name: ['', [Validators.required]],
      tenant_subdomain: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern(/^[a-z0-9-]+$/)
      ]]
    });

    // Step 2: Personal information
    this.personalForm = this.fb.group({
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

    // Validate both forms
    if (this.companyForm.invalid || this.personalForm.invalid) {
      this.markFormGroupTouched(this.companyForm);
      this.markFormGroupTouched(this.personalForm);

      // Check for password mismatch specifically
      if (this.personalForm.errors?.['passwordMismatch']) {
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

    // Combine both form values
    const registerData = {
      ...this.companyForm.value,
      ...this.personalForm.value
    };

    this.authService.register(registerData).subscribe({
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
    return this.companyForm.get('tenant_name');
  }

  get tenant_subdomain() {
    return this.companyForm.get('tenant_subdomain');
  }

  get first_name() {
    return this.personalForm.get('first_name');
  }

  get last_name() {
    return this.personalForm.get('last_name');
  }

  get email() {
    return this.personalForm.get('email');
  }

  get password() {
    return this.personalForm.get('password');
  }

  get password_confirmation() {
    return this.personalForm.get('password_confirmation');
  }

  get termsAgreed() {
    return this.personalForm.get('termsAgreed');
  }
}
