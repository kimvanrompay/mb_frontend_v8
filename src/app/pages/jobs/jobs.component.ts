import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Position {
    id: string;
    title: string;
    description: string;
    department: string;
    location: string;
    status: 'open' | 'closed' | 'draft';
    applicants: number;
    starred: boolean;
    postedDate: Date;
    activityData: number[]; // Last 7 days of applications
}

@Component({
    selector: 'app-jobs',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './jobs.component.html',
    styleUrl: './jobs.component.css'
})
export class JobsComponent implements OnInit {
    positions: Position[] = [];
    filteredPositions: Position[] = [];

    searchQuery = '';
    statusFilter = 'all';
    departmentFilter = 'all';
    sortBy = 'updated';

    departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Operations'];

    ngOnInit() {
        this.loadPositions();
    }

    loadPositions() {
        // Mock data - replace with API call
        this.positions = [
            {
                id: '1',
                title: 'Senior Frontend Developer',
                description: 'Building the face of the Meribas assessment platform',
                department: 'Engineering',
                location: 'Remote',
                status: 'open',
                applicants: 24,
                starred: true,
                postedDate: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
                activityData: [2, 3, 5, 8, 6, 4, 7]
            },
            {
                id: '2',
                title: 'Product Designer',
                description: 'Creating intuitive and beautiful user experiences',
                department: 'Design',
                location: 'New York, NY',
                status: 'open',
                applicants: 18,
                starred: false,
                postedDate: new Date(Date.now() - 13 * 60 * 1000), // 13 minutes ago
                activityData: [1, 2, 4, 3, 5, 2, 3]
            },
            {
                id: '3',
                title: 'Backend Engineer',
                description: 'Scaling our assessment engine to handle millions of users',
                department: 'Engineering',
                location: 'Remote',
                status: 'open',
                applicants: 32,
                starred: false,
                postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                activityData: [3, 4, 6, 5, 7, 8, 6]
            },
            {
                id: '4',
                title: 'Marketing Manager',
                description: 'Leading our growth marketing initiatives',
                department: 'Marketing',
                location: 'London, UK',
                status: 'draft',
                applicants: 0,
                starred: true,
                postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
                activityData: [0, 0, 0, 0, 0, 0, 0]
            }
        ];

        this.applyFilters();
    }

    applyFilters() {
        this.filteredPositions = this.positions.filter(pos => {
            const matchesSearch = pos.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                pos.description.toLowerCase().includes(this.searchQuery.toLowerCase());
            const matchesStatus = this.statusFilter === 'all' || pos.status === this.statusFilter;
            const matchesDepartment = this.departmentFilter === 'all' || pos.department === this.departmentFilter;

            return matchesSearch && matchesStatus && matchesDepartment;
        });

        // Apply sorting
        this.filteredPositions.sort((a, b) => {
            switch (this.sortBy) {
                case 'updated':
                    return b.postedDate.getTime() - a.postedDate.getTime();
                case 'name':
                    return a.title.localeCompare(b.title);
                case 'applicants':
                    return b.applicants - a.applicants;
                case 'starred':
                    return (b.starred ? 1 : 0) - (a.starred ? 1 : 0);
                default:
                    return 0;
            }
        });
    }

    toggleStar(position: Position) {
        position.starred = !position.starred;
    }

    getStatusBadgeClass(status: string): string {
        switch (status) {
            case 'open':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'closed':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }

    getTimeAgo(date: Date): string {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

        if (seconds < 60) return `Updated ${seconds} seconds ago`;
        if (seconds < 3600) return `Updated ${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `Updated ${Math.floor(seconds / 3600)} hours ago`;
        if (seconds < 604800) return `Updated ${Math.floor(seconds / 86400)} days ago`;
        return `Updated ${Math.floor(seconds / 604800)} weeks ago`;
    }
}
