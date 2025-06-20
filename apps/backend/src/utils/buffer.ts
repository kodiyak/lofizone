import type { Readable } from 'node:stream';

export async function streamToBuffer(stream: Readable) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
