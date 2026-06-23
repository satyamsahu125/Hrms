import { Page, Locator } from '@playwright/test';

export class LeavePage {
  constructor(private page: Page) {}

  // Navigation

  private get leaveMenu(): Locator {
    return this.page.getByRole('link', {
      name: 'Leave'
    });
  }

  private get applyLeaveLink(): Locator {
    return this.page.getByRole('link', {
      name: 'Apply Leave'
    });
  }

  private get cancelButton(): Locator {
    return this.page.getByRole('link', {
      name: 'Cancel'
    });
  }

  // Form

  private get startDateInput(): Locator {
        return this.page.locator('input[name="startDate"]');
    }

    private get endDateInput(): Locator {
        return this.page.locator('input[name="endDate"]');
    }

  private get reasonTextArea(): Locator {
    return this.page.locator(
      'textarea[name="reason"]'
    );
  }

  private get submitButton(): Locator {
    return this.page.getByRole('button', {
      name: 'Submit Application'
    });
  }

  // Approval Actions

  private get firstApproveButton(): Locator {
    return this.page
      .getByRole('button', {
        name: 'Approve'
      })
      .first();
  }

  private get firstRejectButton(): Locator {
    return this.page
      .getByRole('button', {
        name: 'Reject'
      })
      .first();
  }

  // Methods

  async openLeavePage() {
    await this.leaveMenu.click();
  }

  async clickApplyLeave() {
    await this.applyLeaveLink.click();
  }

  async enterReason(reason: string) {
    await this.reasonTextArea.fill(reason);
  }

  async submitLeave() {
    await this.submitButton.click();
  }

  async cancelLeave() {
    await this.cancelButton.click();
  }

  async applyLeave(reason: string) {
    await this.clickApplyLeave();
    await this.startDateInput.fill('2026-06-15');

    await this.endDateInput.fill('2026-06-15');
    await this.enterReason(reason);
    await this.submitLeave();
  }

  async approveFirstLeave() {
    await this.firstApproveButton.click();
  }

  async rejectFirstLeave() {
    await this.firstRejectButton.click();
  }
}