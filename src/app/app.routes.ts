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
        path: 'candidates/invitation/:token',
        loadComponent: () => import('./pages/public/candidate-invitation/candidate-invitation.component').then(m => m.CandidateInvitationComponent)
    },
    {
        path: 'assessment/:token',
        loadComponent: () => import('./pages/public/test-runner/test-runner.component').then(m => m.TestRunnerComponent)
    },
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
                path: 'search',
                loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent)
            },
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
            // Feature pages with Coming Soon fallback
            {
                path: 'applications',
                loadComponent: () => import('./pages/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent)
            },
                {
                    path: 'candidates',
                    loadComponent: () => import('./pages/candidates/candidates.component').then(m => m.CandidatesComponent)
                },
                {
                    path: 'candidates/:id',
                    loadComponent: () => import('./pages/candidates/candidate-detail/candidate-detail.component').then(m => m.CandidateDetailComponent)
                },
            {
                path: 'invitations',
                loadComponent: () => import('./pages/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent)
            },
            {
                path: 'metrics',
                loadComponent: () => import('./pages/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent)
            },
            {
                path: 'events',
                loadComponent: () => import('./pages/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent)
            },
            {
                path: 'environment',
                loadComponent: () => import('./pages/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent)
            },
            {
                path: 'deployments',
                loadComponent: () => import('./pages/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent)
            },
            {
                path: 'team',
                loadComponent: () => import('./pages/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent)
            },
            {
                path: 'billing',
                loadComponent: () => import('./pages/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent)
            },
            {
                path: 'integrations',
                loadComponent: () => import('./pages/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent)
            },
            {
                path: 'invite-friend',
                loadComponent: () => import('./pages/invite-friend/invite-friend.component').then(m => m.InviteFriendComponent)
            },
            {
                path: 'team-upgrade',
                loadComponent: () => import('./pages/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent)
            },
            {
                path: 'settings',
                loadComponent: () => import('./pages/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent)
            },
        ]
    }
];
