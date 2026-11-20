import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const isWin = process.platform === 'win32';
const userProfile = process.env.USERPROFILE || '';
const winFirefox = isWin && userProfile && fs.existsSync(path.join(userProfile, 'AppData', 'Local', 'ms-playwright', 'firefox-1555', 'firefox', 'firefox.exe'))
  ? path.join(userProfile, 'AppData', 'Local', 'ms-playwright', 'firefox-1555', 'firefox', 'firefox.exe')
  : undefined;

const winWebkit = isWin && userProfile && fs.existsSync(path.join(userProfile, 'AppData', 'Local', 'ms-playwright', 'webkit-2370', 'Playwright.exe'))
  ? path.join(userProfile, 'AppData', 'Local', 'ms-playwright', 'webkit-2370', 'Playwright.exe')
  : undefined;

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
        ...(isWin ? { channel: 'chrome' } : {}),
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        ...(winFirefox ? { launchOptions: { executablePath: winFirefox } } : {}),
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        ...(winWebkit ? { launchOptions: { executablePath: winWebkit } } : {}),
      },
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        ...(isWin ? { channel: 'chrome' } : {}),
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
