import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'.',testMatch:'baseline-journey.spec.ts',outputDir:'before/results',workers:1,timeout:240000,use:{baseURL:'http://127.0.0.1:5360',viewport:{width:1280,height:900},trace:'retain-on-failure',video:'on'},projects:[{name:'chromium-before',use:{browserName:'chromium'}}]});
