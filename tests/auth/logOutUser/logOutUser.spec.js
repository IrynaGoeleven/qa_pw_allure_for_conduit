import { expect } from '@playwright/test';
import { test } from '../../_fixtures/fixturesGeneric';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { SettingsPage } from '../../../src/ui/pages/SettingsPage';

test.beforeEach(async ({ page, user }) => {
  await signUpUser(page, user);
});

test('Log out user', async ({ page }) => {
  const settingsPage = new SettingsPage(page);

  await settingsPage.open();
  await settingsPage.clickLogout();

  await page.waitForURL('**/');
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
});
