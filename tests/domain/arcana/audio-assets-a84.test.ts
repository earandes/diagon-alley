import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { expect, it } from 'vitest';
import manifest from '../../../design/audio/a84/manifest.json';

it('A84 ships reproducible bounded PCM without clipping, silence or a precache payload', () => {
  expect(manifest.assets).toHaveLength(9);
  let totalBytes = 0;
  for (const asset of manifest.assets) {
    const bytes = readFileSync(asset.file);
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(asset.sha256);
    expect(bytes.subarray(0, 4).toString()).toBe('RIFF');
    expect(bytes.subarray(8, 12).toString()).toBe('WAVE');
    expect(bytes.readUInt16LE(22)).toBe(1);
    expect(bytes.readUInt32LE(24)).toBe(24000);
    expect(bytes.readUInt16LE(34)).toBe(16);
    expect(bytes.subarray(36, 40).toString()).toBe('data');
    let peak = 0,
      square = 0,
      sum = 0;
    for (let offset = 44; offset < bytes.length; offset += 2) {
      const value = bytes.readInt16LE(offset) / 32768;
      peak = Math.max(peak, Math.abs(value));
      square += value * value;
      sum += value;
    }
    const frames = (bytes.length - 44) / 2;
    expect(frames / 24000).toBe(asset.durationSeconds);
    expect(peak).toBeLessThan(0.3);
    expect(Math.sqrt(square / frames)).toBeGreaterThan(0.001);
    expect(Math.abs(sum / frames)).toBeLessThan(0.002);
    expect(
      Math.abs(bytes.readInt16LE(44) - bytes.readInt16LE(bytes.length - 2)) / 32768,
    ).toBeLessThan(0.006);
    totalBytes += bytes.length;
  }
  expect(totalBytes).toBeLessThan(1_300_000);
});
