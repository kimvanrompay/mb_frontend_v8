import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobService } from '../../../services/job.service';
import { SidebarBlackComponent } from '../../../components/layout/sidebar-black/sidebar-black.component';
import { TopbarWhiteComponent } from '../../../components/layout/topbar-white/topbar-white.component';

@Component({
    selector: 'app-job-edit',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, SidebarBlackComponent, TopbarWhiteComponent],
    template: `
    <div class="flex h-screen overflow-hidden bg-[var(--meribas-smoke)]">
      <app-sidebar-black></app-sidebar-black>
      <div class="flex flex-1 flex-col overflow-hidden">
         <app-topbar-white></app-topbar-white>
         <main class="flex-1 overflow-y-auto p-8">
            <div class="mx-auto max-w-3xl">
               
               <div class="mb-8">
                  <a routerLink="/jobs" class="text-sm font-medium text-gray-500 hover:text-black mb-4 inline-block">&larr; Cancel</a>
                  <h1 class="text-3xl font-bold text-[var(--meribas-black)]">{{ isEditMode ? 'Edit Job' : 'Create New Assessment' }}</h1>
               </div>

               <div class="bg-white rounded-[20px] shadow-[var(--shadow-card)] p-8">
                  <form [formGroup]="jobForm" (ngSubmit)="onSubmit()">
                      
                      <!-- Title -->
                      <div class="mb-6">
                          <label class="block text-sm font-bold text-gray-700 mb-2">Job Title</label>
                          <input type="text" formControlName="title" class="input-meribas" placeholder="e.g. Senior Product Designer">
                      </div>

                      <!-- Basic Info Row -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                           <div>
                              <label class="block text-sm font-bold text-gray-700 mb-2">Location</label>
                              <input type="text" formControlName="location" class="input-meribas" placeholder="e.g. Remote / New York">
                           </div>
                           <div>
                              <label class="block text-sm font-bold text-gray-700 mb-2">Employment Type</label>
                              <select formControlName="employment_type" class="input-meribas">
                                  <option value="Full-time">Full-time</option>
                                  <option value="Contract">Contract</option>
                                  <option value="Part-time">Part-time</option>
                              </select>
                           </div>
                      </div>

                      <!-- Description -->
                      <div class="mb-8">
                          <label class="block text-sm font-bold text-gray-700 mb-2">Description</label>
                          <textarea formControlName="description" rows="5" class="input-meribas" placeholder="Describe the role and responsibilities..."></textarea>
                      </div>

                      <div class="flex justify-end pt-6 border-t border-gray-100">
                          <button type="submit" [disabled]="jobForm.invalid || isSubmitting" 
                                  class="bg-[var(--accent-green-600)] text-white px-6 py-3 rounded-md font-bold hover:bg-[var(--accent-green-900)] transition-colors disabled:opacity-50">
                              {{ isEditMode ? 'Save Changes' : 'Create Job' }}
                          </button>
                      </div>

                  </form>
               </div>

            </div>
         </main>
      </div>
    </div>
  `,
    styles: [`
    .input-meribas {
        @apply block w-full rounded-md border-0 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6;
    }
  `]
})
export class JobEditComponent implements OnInit {
    jobForm: FormGroup;
    isEditMode = false;
    isSubmitting = false;
    jobId: string | null = null;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private jobService: JobService
    ) {
        this.jobForm = this.fb.group({
            title: ['', Validators.required],
            location: ['', Validators.required],
            employment_type: ['Full-time', Validators.required],
            description: ['']
        });
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.isEditMode = true;
                this.jobId = id;
                this.jobService.getJob(id).subscribe(res => {
                    this.jobForm.patchValue(res);
                });
            }
        });
    }

    onSubmit() {
        if (this.jobForm.valid) {
            this.isSubmitting = true;
            const jobData = this.jobForm.value;

            const request = this.jobId
                ? this.jobService.updateJob(this.jobId, jobData)
                : this.jobService.createJob(jobData);

            request.subscribe({
                next: () => this.router.navigate(['/jobs']),
                error: (err) => {
                    console.error('Error saving job:', err);
                    this.isSubmitting = false;
                }
            });
        }
    }
}
