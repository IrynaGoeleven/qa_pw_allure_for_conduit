import { expect, testStep } from '../../common/helpers/pw';

export class SettingsPage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.profilePictureField = page.getByPlaceholder('URL of profile picture');
    this.usernameField = page.getByPlaceholder('Username');
    this.bioField = page.getByPlaceholder('Short bio about you');
    this.emailField = page.getByPlaceholder('Email');
    this.passwordField = page.getByPlaceholder('New Password');
    this.updateSettingsButton = page.getByRole('button', {
      name: 'Update Settings',
    });
    this.logoutButton = page.getByRole('button', {
      name: 'Or click here to logout.',
    });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  async open() {
    await this.step(`Open 'Settings' page`, async () => {
      await this.page.goto('/settings');
    });
  }

  async fillProfilePictureUrl(url) {
    await this.step(`Fill the 'URL of profile picture' field`, async () => {
      await this.profilePictureField.fill(url);
    });
  }

  async fillUsername(username) {
    await this.step(`Fill the 'Username' field`, async () => {
      await this.usernameField.fill(username);
    });
  }

  async fillBio(bio) {
    await this.step(`Fill the 'Short bio about you' field`, async () => {
      await this.bioField.fill(bio);
    });
  }

  async fillEmail(email) {
    await this.step(`Fill the 'Email' field`, async () => {
      await this.emailField.fill(email);
    });
  }

  async fillPassword(password) {
    await this.step(`Fill the 'New Password' field`, async () => {
      await this.passwordField.fill(password);
    });
  }

  async clickUpdateSettings() {
    await this.step(`Click the 'Update Settings' button`, async () => {
      await this.updateSettingsButton.click();
    });
  }

  async clickLogout() {
    await this.step(`Click the 'Logout' button`, async () => {
      await this.logoutButton.click();
    });
  }

  async assertProfilePictureIsVisible(url) {
    await this.step(`Assert the profile picture is visible`, async () => {
      await expect(this.page.locator('img').first()).toHaveAttribute(
        'src',
        url,
      );
    });
  }

  async assertBioIsVisible(bio) {
    await this.step(`Assert the short bio is visible`, async () => {
      await expect(this.page.getByText(bio)).toBeVisible();
    });
  }
}
