import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { WelcomeComponent } from './pages/onboarding/welcome/welcome.component';
import { AssessmentComponent } from './pages/onboarding/assessment/assessment.component';
import { SuccessComponent } from './pages/onboarding/success/success.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'onboarding',
        children: [
            { path: '', component: WelcomeComponent },
            { path: 'assessment', component: AssessmentComponent },
            { path: 'success', component: SuccessComponent }
        ]
    },
    { path: 'dashboard', component: DashboardComponent },
];
