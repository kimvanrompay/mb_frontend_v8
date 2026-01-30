import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { VerifyEmailComponent } from './pages/verify-email/verify-email';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { WelcomeComponent } from './pages/onboarding/welcome/welcome.component';
import { AssessmentComponent } from './pages/onboarding/assessment/assessment.component';
import { SuccessComponent } from './pages/onboarding/success/success.component';

import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'verify-email', component: VerifyEmailComponent },
    {
        path: 'onboarding',
        children: [
            { path: '', redirectTo: 'welcome', pathMatch: 'full' },
            { path: 'welcome', component: WelcomeComponent },
            { path: 'assessment', component: AssessmentComponent },
            { path: 'success', component: SuccessComponent }
        ]
    },
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            {
                path: 'jobs',
                loadComponent: () => import('./pages/jobs/jobs.component').then(m => m.JobsComponent)
            },
            {
                path: 'jobs/new',
                loadComponent: () => import('./pages/jobs/job-edit/job-edit.component').then(m => m.JobEditComponent)
            },
            {
                path: 'jobs/:id',
                loadComponent: () => import('./pages/jobs/job-detail/job-detail.component').then(m => m.JobDetailComponent)
            },
            {
                path: 'jobs/:id/edit',
                loadComponent: () => import('./pages/jobs/job-edit/job-edit.component').then(m => m.JobEditComponent)
            },
            // Fallback for other potential routes in the future
            {
                path: 'applications',
                loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent) // Placeholder
            },
            {
                path: 'candidates',
                loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent) // Placeholder
            },
            {
                path: 'collections',
                loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent) // Placeholder
            },
            {
                path: 'certs',
                loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent) // Placeholder
            },
            {
                path: 'settings',
                loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent) // Placeholder
            },
        ]
    }
];
