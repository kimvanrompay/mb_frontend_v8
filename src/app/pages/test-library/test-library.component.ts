import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AssessmentService } from '../../services/assessment.service';
import { TestCatalogItem } from '../../models/assessment.model';

@Component({
    selector: 'app-test-library',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './test-library.component.html',
    styles: []
})
export class TestLibraryComponent implements OnInit {
    tests: TestCatalogItem[] = [];
    filteredTests: TestCatalogItem[] = [];
    loading = true;
    error: string | null = null;

    searchQuery = '';
    categoryFilter = 'all';
    
    // Sort options
    sortBy: 'name' | 'duration' | 'questions' | 'category' = 'name';

    constructor(private assessmentService: AssessmentService) { }

    ngOnInit() {
        this.loadCatalog();
    }

    loadCatalog() {
        this.loading = true;
        this.assessmentService.getTestCatalog().subscribe({
            next: (response) => {
                this.tests = response.tests;
                this.applyFilters();
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading test catalog:', err);
                this.error = 'Failed to load test library. Please try again.';
                this.loading = false;
            }
        });
    }

    applyFilters() {
        this.filteredTests = this.tests.filter(test => {
            const matchesSearch = test.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                                  test.description.toLowerCase().includes(this.searchQuery.toLowerCase());
            const matchesCategory = this.categoryFilter === 'all' || test.category === this.categoryFilter;
            
            return matchesSearch && matchesCategory;
        });

        // Sort
        this.filteredTests.sort((a, b) => {
            switch (this.sortBy) {
                case 'name': return a.name.localeCompare(b.name);
                case 'duration': return a.duration_minutes - b.duration_minutes;
                case 'questions': return a.question_count - b.question_count;
                case 'category': return a.category.localeCompare(b.category);
                default: return 0;
            }
        });
    }

    formatCategory(category: string): string {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    getCategoryColor(category: string): string {
        switch(category) {
            case 'psychology': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'cognitive': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'skill': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'technical': return 'bg-amber-100 text-amber-800 border-amber-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }
}
