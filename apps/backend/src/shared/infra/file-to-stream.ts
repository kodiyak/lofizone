import { Writable } from 'stream';

export function fileToStream(stream: Writable, file: File) {
  const reader = file.stream().getReader();
  const start = Date.now();
  let done = false;
  setInterval(async () => {
    if (done) return;

    const { value, done: isDone } = await reader.read();
    if (isDone) {
      done = true;
      stream.end();
      return;
    }

    stream.write(value);
  }, 1);
  const end = Date.now();
  const duration = end - start;
  console.log(`File read in ${duration}ms`);

  return stream;
}
