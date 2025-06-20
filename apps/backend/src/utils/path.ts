import { resolve } from 'node:path';

export function temp(...paths: string[]) {
  return resolve(__dirname, '..', '..', 'tmp', ...paths);
}

export function sounds(...paths: string[]) {
  return resolve(__dirname, '..', '..', 'sounds', ...paths);
}
