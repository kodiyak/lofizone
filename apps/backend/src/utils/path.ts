import path, { resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function temp(...paths: string[]) {
  return resolve(__dirname, '..', '..', 'tmp', ...paths);
}
