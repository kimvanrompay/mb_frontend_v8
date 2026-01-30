import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-invite-friend',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="max-w-2xl mx-auto py-8 px-4">
      
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-medium text-black mb-2">Invite a Friend</h1>
        <p class="text-sm text-gray-600">
          You can invite anyone to Meribas directly via url to register
        </p>
      </div>

      <!-- Invite Form Card -->
      <div class="meribas-card">
        
        <!-- Referral Link Section -->
        <div class="mb-6">
          <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Your Referral Link</label>
          <div class="flex gap-2">
            <input 
              type="text" 
              readonly
              [value]="referralUrl"
              class="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm font-mono bg-gray-50 text-gray-700 focus:outline-none focus:border-green-500"
            />
            <button 
              (click)="copyToClipboard()"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-white px-2 text-gray-500 font-mono">Or send via email</span>
          </div>
        </div>

        <!-- Email Invite Section -->
        <div class="mb-6">
          <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Email Address</label>
          <input 
            type="email" 
            [(ngModel)]="email"
            placeholder="colleague@company.com"
            class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-green-500"
          />
        </div>

        <!-- Send Button -->
        <button 
          (click)="sendInvite()"
          [disabled]="!email || sending"
          class="w-full px-4 py-3 bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors">
          {{ sending ? 'Sending...' : 'Send Invite' }}
        </button>

        <!-- Success Message -->
        <div *ngIf="inviteSent" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p class="text-sm text-green-700">✓ Invitation sent successfully!</p>
        </div>

        <!-- Reward Info -->
        <div class="mt-6 p-4 bg-green-50 border-l-4 border-green-600 rounded">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="text-sm font-medium text-green-900">Earn rewards by inviting friends</p>
              <p class="text-xs text-green-700 mt-1">Get a reward of <strong>10 credits</strong> when your friend signs up and verifies their account.</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Stats Card -->
      <div class="mt-6 meribas-card">
        <h3 class="text-sm font-medium text-black mb-4">Your Referral Stats</h3>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <div class="text-xs text-gray-500 uppercase font-mono mb-1">Invites Sent</div>
            <div class="text-2xl font-medium font-mono text-black">{{ stats.sent }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500 uppercase font-mono mb-1">Accepted</div>
            <div class="text-2xl font-medium font-mono text-green-600">{{ stats.accepted }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500 uppercase font-mono mb-1">Credits Earned</div>
            <div class="text-2xl font-medium font-mono text-green-600">{{ stats.credits }}</div>
          </div>
        </div>
      </div>

    </div>
  `,
    styles: []
})
export class InviteFriendComponent {
    email = '';
    sending = false;
    inviteSent = false;
    copied = false;
    referralUrl = 'https://meribas.app/register?ref=YOUR_CODE';

    stats = {
        sent: 12,
        accepted: 5,
        credits: 50
    };

    copyToClipboard(): void {
        navigator.clipboard.writeText(this.referralUrl);
        this.copied = true;
        setTimeout(() => this.copied = false, 2000);
    }

    sendInvite(): void {
        if (!this.email) return;

        this.sending = true;

        // Simulate API call
        setTimeout(() => {
            this.sending = false;
            this.inviteSent = true;
            this.email = '';

            // Hide success message after 3 seconds
            setTimeout(() => this.inviteSent = false, 3000);
        }, 1000);
    }
}
