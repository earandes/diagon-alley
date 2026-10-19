import { defineSafeConfig } from './tools/verification/playwright-safety';
import { priorityBrowserOptions } from './playwright.priorities-a89.options';

/** Linux-only, shared lock/watchdog, one worker and no recording/retries. Never bypass on the Mac. */
export default defineSafeConfig(priorityBrowserOptions);
