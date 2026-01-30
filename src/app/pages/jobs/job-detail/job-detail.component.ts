import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { Job } from '../../../models/job.model';
import { SidebarBlackComponent } from '../../../components/layout/sidebar-black/sidebar-black.component';
import { TopbarWhiteComponent } from '../../../components/layout/topbar-white/topbar-white.component';
import { CardBaseComponent } from '../../../components/cards/card-base/card-base.component';

@Component({
   selector: 'app-job-detail',
   standalone: true,
   imports: [CommonModule, RouterModule, SidebarBlackComponent, TopbarWhiteComponent, CardBaseComponent],
   template: `
    <div class="flex h-screen overflow-hidden bg-[var(--meribas-smoke)]">
      <app-sidebar-black></app-sidebar-black>
      <div class="flex flex-1 flex-col overflow-hidden">
         <app-topbar-white></app-topbar-white>
         <main class="flex-1 overflow-y-auto p-8">
            <div class="mx-auto max-w-6xl" *ngIf="job">
               
               <!-- Nav & Header -->
               <div class="mb-8">
                  <a routerLink="/jobs" class="text-sm font-medium text-gray-500 hover:text-black mb-4 inline-block">&larr; Back to Jobs</a>
                  <div class="flex items-center justify-between">
                     <div>
                        <h1 class="text-3xl font-bold text-[var(--meribas-black)]">{{ job.title }}</h1>
                        <p class="text-gray-500 mt-1 flex items-center gap-2">
                           {{ job.location }} • {{ job.employment_type }} 
                           <span class="integrity-badge verified">{{ job.status }}</span>
                        </p>
                     </div>
                     <a [routerLink]="['/jobs', job.id, 'edit']" class="btn-secondary">Edit Assessment</a>
                  </div>
               </div>

               <!-- Stats Grid -->
               <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <app-card-base>
                     <div class="text-center py-4">
                        <div class="text-4xl font-extrabold text-[var(--meribas-black)]">{{ job.total_applications }}</div>
                        <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Total Applicants</div>
                     </div>
                  </app-card-base>
                   <app-card-base>
                     <div class="text-center py-4">
                        <div class="text-4xl font-extrabold text-[var(--accent-green-600)]">{{ job.pending_applications }}</div>
                        <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">New Candidates</div>
                     </div>
                  </app-card-base>
                   <app-card-base>
                     <div class="text-center py-4">
                        <div class="text-4xl font-extrabold text-[var(--meribas-black)]">85<span class="text-base">%</span></div>
                        <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Avg. Score</div>
                     </div>
                  </app-card-base>
               </div>

               <!-- Details Section -->
               <div class="bg-white rounded-[20px] shadow-[var(--shadow-card)] p-8">
                  <h2 class="text-lg font-bold text-[var(--meribas-black)] mb-4">Job Description</h2>
                  <div class="prose prose-sm max-w-none text-gray-600">
                     <p>{{ job.description || 'No description provided.' }}</p>
                  </div>

                  <hr class="my-8 border-gray-100">

                  <h2 class="text-lg font-bold text-[var(--meribas-black)] mb-4">Assessment Pipeline</h2>
                  <div class="space-y-4">
                      <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <div class="flex items-center gap-4">
                              <div class="h-8 w-8 rounded-full bg-[var(--meribas-black)] text-white flex items-center justify-center font-bold">1</div>
                              <span class="font-medium">Resume Screening</span>
                          </div>
                          <span class="text-sm text-gray-400">Automated</span>
                      </div>
                      <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <div class="flex items-center gap-4">
                              <div class="h-8 w-8 rounded-full bg-[var(--meribas-black)] text-white flex items-center justify-center font-bold">2</div>
                              <span class="font-medium">Cognitive Ability Test</span>
                          </div>
                          <span class="text-sm text-[var(--accent-green-600)] font-medium">Meribas Proctoring Active</span>
                      </div>
                       <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <div class="flex items-center gap-4">
                              <div class="h-8 w-8 rounded-full bg-[var(--meribas-black)] text-white flex items-center justify-center font-bold">3</div>
                              <span class="font-medium">Technical Assessment (Python)</span>
                          </div>
                          <span class="text-sm text-[var(--accent-green-600)] font-medium">Meribas Proctoring Active</span>
                      </div>
                  </div>
               </div>

            </div>
         </main>
      </div>
    </div>
  `,
   styles: [`
    .btn-secondary {
       @apply inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50;
    }
  `]
})
export class JobDetailComponent implements OnInit {
   job: Job | null = null;

   constructor(
      private route: ActivatedRoute,
      private jobService: JobService
   ) { }

   ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
         this.jobService.getJob(id).subscribe(res => {
            this.job = res;
         });
      }
   }
}
