import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const userProfile = process.env.USERPROFILE || 'C:\\Users\\dutch';
const playwrightBrowsers = path.join(userProfile, 'AppData', 'Local', 'ms-playwright');

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        launchOptions: {
          executablePath: path.join(playwrightBrowsers, 'firefox-1555', 'firefox', 'firefox.exe'),
        },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        launchOptions: {
          executablePath: path.join(playwrightBrowsers, 'webkit-2370', 'Playwright.exe'),
        },
      },
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        channel: 'chrome',
      },
    },
  ],
  webServer: {
    command: 'node e2e/server.mjs',
    url: 'http://127.0.0.1:4173/examples/vanilla-html/index.html',
    reuseExistingServer: true,
    timeout: 15000,
  },
});
