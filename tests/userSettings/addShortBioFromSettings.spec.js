import { expect } from '@playwright/test';
import { test } from '../_fixtures/fixturesGeneric';
import { signUpUser } from '../../src/ui/actions/auth/signUpUser';
import { SettingsPage } from '../../src/ui/pages/SettingsPage';

test.beforeEach(async ({ page, user }) => {
  await signUpUser(page, user);
});

test('Add short bio from settings', async ({ page }) => {
  const bioText = 'Automation QA engineer focused on reliable testing.';
  const settingsPage = new SettingsPage(page);

  await settingsPage.open();
  await settingsPage.fillBio(bioText);
  await settingsPage.clickUpdateSettings();

  await page.waitForURL('**/profile/**');
  await expect(page.getByText(bioText)).toBeVisible();
});
