import { nanoid } from 'nanoid';

export function generateId(prefix: string): string {
  return [prefix, nanoid(10)].join('_');
}
