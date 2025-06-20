import { nanoid } from 'nanoid';

export function generateId(prefix: string) {
  return [prefix, nanoid(10)].join('_');
}
