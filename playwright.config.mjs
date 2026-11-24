export default {
 testDir: './e2e',
 timeout: 30000,
 retries: 1,
 failOnFlakyTests: !!process.env.CI,
 forbidOnly: !!process.env.CI,
 use: { baseURL:'http://127.0.0.1:4173', browserName:'chromium', headless:true, viewport:{width:1440,height:1000}, screenshot:'only-on-failure' },
 webServer: { command:'node scripts/dev.mjs',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI,timeout:20000 }
};
