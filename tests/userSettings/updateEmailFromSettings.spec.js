import { expect } from '@playwright/test';
import { test } from '../_fixtures/fixturesGeneric';
import { signUpUser } from '../../src/ui/actions/auth/signUpUser';
import { SettingsPage } from '../../src/ui/pages/SettingsPage';

test.beforeEach(async ({ page, user }) => {
  await signUpUser(page, user);
});

test('Update email from settings', async ({ page, user }) => {
  const updatedEmail = `${user.username}_updated@example.com`;
  const settingsPage = new SettingsPage(page);

  await settingsPage.open();
  await settingsPage.fillEmail(updatedEmail);
  await settingsPage.clickUpdateSettings();

  await page.waitForURL('**/profile/**');
  await page.goto('/settings');
  await page.waitForURL('**/settings');

  await expect(page.getByPlaceholder('Email')).toHaveValue(updatedEmail);
});
