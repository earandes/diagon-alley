import { defineConfig } from '@playwright/test';
import { randomUUID } from 'node:crypto';
const namespace=`a63-actions-${randomUUID()}`;
export default defineConfig({testDir:'./tests/browser-trial',testMatch:'action-profile-a63.spec.ts',outputDir:'test-results-actions-a63',workers:1,timeout:120000,use:{baseURL:'http://127.0.0.1:5380',viewport:{width:1280,height:900}},projects:[{name:'chromium',use:{browserName:'chromium'}},{name:'webkit',use:{browserName:'webkit',baseURL:'http://127.0.0.1:5381'}}],webServer:[5380,5381].map(port=>({env:{ARCANA_TRIAL_NAMESPACE:`${namespace}-${port}`},command:`npx --no-install vite preview --host 127.0.0.1 --port ${port} --strictPort --mode arcana`,url:`http://127.0.0.1:${port}/`,reuseExistingServer:false}))});
