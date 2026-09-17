import { expect } from '@playwright/test';
import { test } from '../_fixtures/fixtures';
import { signUpUser } from '../../src/ui/actions/auth/signUpUser';
import { SettingsPage } from '../../src/ui/pages/SettingsPage';

test.beforeEach(async ({ page, user }) => {
  await signUpUser(page, user);
});

test('Update username from settings', async ({ page, user }) => {
  const updatedUsername = `${user.username}_updated`;
  const settingsPage = new SettingsPage(page);

  await settingsPage.open();
  await settingsPage.fillUsername(updatedUsername);
  await settingsPage.clickUpdateSettings();

  await page.waitForURL(`**/profile/${updatedUsername}`);
  await expect(page.getByText(updatedUsername).first()).toBeVisible();
});
