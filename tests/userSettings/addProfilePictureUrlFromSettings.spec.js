import { expect } from '@playwright/test';
import { test } from '../_fixtures/fixturesGeneric';
import { signUpUser } from '../../src/ui/actions/auth/signUpUser';
import { SettingsPage } from '../../src/ui/pages/SettingsPage';

test.beforeEach(async ({ page, user }) => {
  await signUpUser(page, user);
});

test('Add profile picture URL from settings', async ({ page }) => {
  const profilePictureUrl =
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde';
  const settingsPage = new SettingsPage(page);

  await settingsPage.open();
  await settingsPage.fillProfilePictureUrl(profilePictureUrl);
  await settingsPage.clickUpdateSettings();

  await page.waitForURL('**/profile/**');
  await expect(page.locator('img').first()).toHaveAttribute(
    'src',
    profilePictureUrl,
  );
});
