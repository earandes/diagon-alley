/** Local presentation preference; never part of a command or a combat snapshot. */
export const playbackSpeedKey = 'arcana:playback-speed:v1';
export function readPlaybackSpeed(storage?: Pick<Storage, 'getItem'>): 1 | 2 {
  try {
    return storage?.getItem(playbackSpeedKey) === '2' ? 2 : 1;
  } catch {
    return 1;
  }
}
export function savePlaybackSpeed(speed: 1 | 2, storage?: Pick<Storage, 'setItem'>): void {
  try {
    storage?.setItem(playbackSpeedKey, String(speed));
  } catch {
    /* Preferences are optional. */
  }
}
