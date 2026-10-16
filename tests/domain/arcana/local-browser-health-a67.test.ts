import { it, expect } from 'vitest';
import {
  localBrowserRisk,
  ownedDescendants,
} from '../../../tools/verification/local-browser-health.ts';
const healthy = {
  load: 2,
  cores: 12,
  windowServerPid: 123,
  windowServerRssMb: 200,
  windowServerCpu: 5,
};
it('refuses high load, WindowServer pressure and a compositor restart', () => {
  expect(localBrowserRisk(healthy)).toEqual([]);
  for (const patch of [
    { load: 30 },
    { windowServerRssMb: 500 },
    { windowServerCpu: 90 },
    { windowServerPid: 456 },
  ])
    expect(localBrowserRisk({ ...healthy, ...patch }, healthy).length).toBeGreaterThan(0);
});
it('tracks only descendants of our runner, leaving a personal browser outside ownership', () => {
  const rows = [
    { pid: 100, parent: 1, name: 'runner' },
    { pid: 101, parent: 100, name: 'preview' },
    { pid: 102, parent: 100, name: 'worker' },
    { pid: 103, parent: 102, name: 'chromium' },
    { pid: 200, parent: 1, name: 'personal chrome' },
  ];
  expect(ownedDescendants(rows, 100).map((r) => r.pid)).toEqual([100, 101, 102, 103]);
});
