import { Member } from '@workspace/db';
import { generateObject } from 'ai';
import { writeAsync } from 'fs-jetpack';
import { z } from 'zod';
import { db } from '../lib/clients/db';
import { baseModel } from '../lib/clients/models';
import { sendAudio } from '../modules/channels/sendAudio';
import { generateAudio } from '../modules/ai/audio';
import { temp } from '../utils/path';

async function main() {
  // const result = await mergeAudios({
  //   audios: [
  //     sounds("pre.mp3"),
  //     sounds("proverbios-20.mp3"),
  //     sounds("late.mp3"),
  //   ],
  //   output: temp("output.mp3"),
  // });

  // await mixAudios({
  //   input: sounds("proverbios-20.mp3"),
  //   output: temp("proverbios-20-with-sound.mp3"),
  //   segments: [
  //     {
  //       starts: 1000,
  //       ends: 35000,
  //       volume: 0.1,
  //       path: sounds("bg-sound-01.mp3"),
  //     },
  //   ],
  // });

  const member = await db.member.findUniqueOrThrow({
    where: { phone: '5511991174114' },
  });

  const audios = await generateAudios(member);

  console.log({
    audios: audios.object.steps,
  });

  const [welcome, goodbye] = await Promise.all([
    await generateAudio({
      value: audios.object.steps.welcome.audioContent,
      voice: 'NFG5qt843uXKj4pFvR7C',
    }).then(async (res) => {
      const path = temp('welcome.mp3');
      await writeAsync(path, res);
      return path;
    }),
    await generateAudio({
      value: audios.object.steps.goodbye.audioContent,
      voice: 'NFG5qt843uXKj4pFvR7C',
    }).then(async (res) => {
      const path = temp('goodbye.mp3');
      await writeAsync(path, res);
      return path;
    }),
  ]);

  console.log({
    welcome,
    goodbye,
  });
  // const welcome = await generateAudio({
  //   value: audios.object.steps.welcome.audioContent,
  // });

  await sendAudio({
    phone: member.phone,
    audio: welcome,
  });
  await sendAudio({
    phone: member.phone,
    audio: goodbye,
  });

  // await Promise.all([
  //   async () => {
  //     await sendText({
  //       phone: member.phone,
  //       text: `Opa ${member.name}, tudo bem?`,
  //       delay: 1830,
  //     });
  //     await sendText({
  //       phone: member.phone,
  //       text: "Pode falar agora?",
  //       delay: 1830,
  //     });
  //   },
  //   async () => {
  //     await sendAudio({
  //       phone: member.phone,
  //       audio: temp("proverbios-20-with-sound.mp3"),
  //     });
  //   },
  // ]);
}

const audioSchema = z.object({
  audioContent: z.string().describe('Conteudo do áudio'),
  reasoning: z.string().describe('Raciocínio que você usou para gerar o áudio'),
});

async function generateAudios(member: Member) {
  const audios = await generateObject({
    model: baseModel,
    schema: z.object({
      steps: z.object({
        welcome: audioSchema,
        goodbye: audioSchema,
      }),
    }),
    messages: [
      {
        role: 'system',
        content: `Você é um assistente de voz que fala com o usuário. 
        Você deve gerar áudios para cada passo do processo, adequando-o ao contexto do usuário.
        O áudio deve ser gerado em português usando palavras claras e consisas para falas.
        O áudio deve ter no máximo 30 segundos de duração.`,
      },
      {
        role: 'user',
        content: `Olá, meu nome é ${member.name} e você está me enviando uma mensagem de voz.
        Porém, você deve me cumprimentar antes e depois dessa mensagem de voz, ao qual o conteudo será de provérbios-20, da bíblia.
        Me cumprimente dando um prelúdio amigável e depois me deseje um bom dia.
        Ao se despedir, você deve me desejar um bom dia e me dizer que de noite você manda outro áudio.`,
      },
    ],
  });

  return audios;
}
