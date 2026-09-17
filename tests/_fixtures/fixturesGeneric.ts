import { mergeTests, test as base } from '@playwright/test';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { Logger } from '../../src/common/logger/Logger';
import { generateNewUserData } from '../../src/common/testData/generateNewUserData';
import * as allure from 'allure-js-commons';
import { parseTestTreeHierarchy } from '../../src/common/helpers/allureHelpers';
import { test as authTest } from './fixturesAuth';
import { test as articleTest } from './fixturesArticle';

const genericTest = base.extend<
  {
    usersNumber;
    contextsNumber;
    pages;
    user;
    users;
    infoTestLog;
    addAllureTestHierarchy;
  },
  {
    logger;
  }
>({
  usersNumber: [1, { option: true }],
  contextsNumber: [1, { option: true }],
  pages: async ({ browser, contextsNumber }, use) => {
    let pages = Array(contextsNumber);

    for (let i = 0; i < contextsNumber; i++) {
      const context = await browser.newContext();

      pages[i] = await context.newPage();
    }
    await use(pages);
  },
  user: async ({ logger }, use) => {
    const user = generateNewUserData(logger);

    await use(user);
  },
  users: async ({ logger, usersNumber }, use) => {
    const users = Array(usersNumber);

    for (let i = 0; i < usersNumber; i++) {
      users[i] = generateNewUserData(logger);
    }

    await use(users);
  },
  logger: [
    async ({}, use) => {
      const logger = new Logger('error');

      await use(logger);
    },
    { scope: 'worker' },
  ],
  cleanAllureResults: [
    async ({}, use) => {
      const resultsDirectory = path.resolve(process.cwd(), 'allure-results');

      await fs.rm(resultsDirectory, { recursive: true, force: true });
      await use(undefined);
    },
    { scope: 'worker', auto: true },
  ],
  infoTestLog: [
    async ({ logger }, use, testInfo) => {
      const indexOfTestSubfolderStart = testInfo.file.indexOf('/tests') + 7;
      const fileName = testInfo.file.substring(indexOfTestSubfolderStart);

      logger.info(`Test started: ${fileName}`);

      await use('infoTestLog');

      logger.info(`Test completed: ${fileName}`);
    },
    { scope: 'test', auto: true },
  ],
  addAllureTestHierarchy: [
    async ({ logger }, use, testInfo) => {
      const fileName = testInfo.file;

      const [parentSuite, suite, subSuite] = parseTestTreeHierarchy(
        fileName,
        logger,
      );

      await allure.parentSuite(parentSuite);
      await allure.suite(suite);
      if (subSuite) {
        await allure.subSuite(subSuite);
      }

      await use('addAllureTestHierarhy');
    },
    { scope: 'test', auto: true },
  ],
});

export const test = mergeTests(authTest, genericTest, articleTest);
