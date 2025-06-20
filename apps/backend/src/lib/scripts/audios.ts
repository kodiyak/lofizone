import { readAsync } from 'fs-jetpack';
import { db } from '../clients/db';
import { generateAudio } from '../../modules/ai/audio';
import { temp } from '../../utils/path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { uploadFile } from '../clients/s3';

async function main() {
  const { limit } = await yargs(hideBin(process.argv))
    .option('limit', {
      alias: 'l',
      type: 'number',
      description: 'Número máximo de itens',
      default: 2,
    })
    .parse();
  const verses = await db.verse.findMany({
    select: {
      id: true,
      text: true,
    },
    where: { voice: null },
    take: limit,
  });
  const total = await db.verse.count({
    where: { voice: null },
  });

  console.log(`Verses: ${verses.length} / ${total}`);

  const generations: {
    id: string;
    voice: string;
    path: string;
  }[] = [];
  for (const verse of verses) {
    const { audio: file, voice } = await generateAudio({
      value: verse.text,
    });

    const path = `audios/${verse.id}.mp3`;
    await uploadFile({
      path,
      file,
    });

    console.log(`Uploading "${path}" (${verse.text})`);

    generations.push({
      id: verse.id,
      path,
      voice,
    });
  }

  await db.$transaction(
    generations.map((generation) =>
      db.verse.update({
        where: { id: generation.id },
        data: {
          audio: generation.path,
          voice: generation.voice,
        },
      }),
    ),
  );
  console.log('Updated ' + generations.length + ' verses');
}

main();
