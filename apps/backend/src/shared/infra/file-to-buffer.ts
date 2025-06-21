export function fileToBuffer(file: File): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const reader = file.stream().getReader();

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    const readNextChunk = async () => {
      try {
        const { value, done } = await reader.read();
        if (done) {
          const buffer = Buffer.concat(chunks, totalBytes);
          resolve(buffer);
          return;
        }
        chunks.push(value);
        totalBytes += value.length;
        readNextChunk();
      } catch (error) {
        reject(error);
      }
    };

    readNextChunk();
    reader.closed.catch((error) => {
      reject(error);
    });
  });
}
