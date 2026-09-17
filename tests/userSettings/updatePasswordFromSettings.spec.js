import { test } from '../_fixtures/fixturesGeneric';
import { signUpUser } from '../../src/ui/actions/auth/signUpUser';
import { SettingsPage } from '../../src/ui/pages/SettingsPage';
import { SignInPage } from '../../src/ui/pages/auth/SignInPage';
import { HomePage } from '../../src/ui/pages/HomePage';

test.beforeEach(async ({ page, user }) => {
  await signUpUser(page, user);
});

test('Update password from settings', async ({ page, user }) => {
  const updatedPassword = 'UpdatedPass123';
  const settingsPage = new SettingsPage(page);
  const signInPage = new SignInPage(page);
  const homePage = new HomePage(page);

  await settingsPage.open();
  await settingsPage.fillPassword(updatedPassword);
  await settingsPage.clickUpdateSettings();

  await page.waitForURL('**/profile/**');
  await page.goto('/settings');
  await page.waitForURL('**/settings');
  await settingsPage.clickLogout();
  await page.waitForURL('**/');

  await signInPage.open();
  await signInPage.fillEmailField(user.email);
  await signInPage.fillPasswordField(updatedPassword);
  await signInPage.clickSignInButton();

  await homePage.assertYourFeedTabIsVisible();
});
