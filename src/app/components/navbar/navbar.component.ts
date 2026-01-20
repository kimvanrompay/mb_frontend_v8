import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, ClickOutsideDirective],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
    user: User | null = null;
    isProfileMenuOpen = false;
    isMobileMenuOpen = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Get current user
        this.authService.currentUser$.subscribe(user => {
            this.user = user;
        });

        // Load user data if not already loaded
        if (!this.user) {
            this.authService.loadMe().subscribe();
        }
    }

    toggleProfileMenu(): void {
        this.isProfileMenuOpen = !this.isProfileMenuOpen;
    }

    toggleMobileMenu(): void {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }

    closeMenus(): void {
        this.isProfileMenuOpen = false;
        this.isMobileMenuOpen = false;
    }

    navigateToProfile(): void {
        this.closeMenus();
        // TODO: Navigate to profile page when ready
        console.log('Navigate to profile');
    }

    navigateToSettings(): void {
        this.closeMenus();
        // TODO: Navigate to settings page when ready
        console.log('Navigate to settings');
    }

    logout(): void {
        this.closeMenus();
        this.authService.logout();
    }

    getUserInitials(): string {
        if (!this.user) return '?';
        const firstInitial = this.user.first_name?.charAt(0) || '';
        const lastInitial = this.user.last_name?.charAt(0) || '';
        return (firstInitial + lastInitial).toUpperCase() || '?';
    }
}
