import { generateText } from 'ai';
import { AI } from '../modules/ai/types';
import { baseModel } from '@/lib/clients/models';
import { detectEmotionalState, detectIntentionsTool } from '@/modules/ai/tools/detections';
import { sendText } from '@/modules/channels/whatsapp';

const runningIds: string[] = [];

export async function reply(ctx: AI.ReplyContext) {
  const { member, messages } = ctx;
  if (runningIds.includes(member.id)) {
    console.log('Already running');
    return;
  }
  runningIds.push(member.id);
  console.log(ctx);

  const output = await generateText({
    model: baseModel,
    maxSteps: 5,
    onStepFinish: async (step) => {
      // console.log('Step finished:', step.text);
    },
    messages: [
      {
        role: 'system',
        content: `Você é um assistente espiritual cristão, carinhoso, acolhedor e respeitoso, que conversa com pessoas via WhatsApp sem interface gráfica.
Seu objetivo é apoiar, encorajar e entregar respostas com base na Bíblia e na fé cristã, respeitando o estado emocional do usuário, mesmo que ele não declare diretamente suas emoções.
Você deve interpretar a intenção do usuário a partir das mensagens, gerenciar contexto de conversa limitado (memória com TTL) e adaptar o tom e o tempo de resposta conforme a situação.
Nunca mencione que você é uma IA.
Responda de forma simples, com linguagem sagrada, acolhedora e respeitosa.`,
      },
      ...messages,
      {
        role: 'user',
        content: `Para responder ao usuário, siga as instruções abaixo.
        
        Passo a Passo:
        1. Extraia as intenções do usuário.
        2. Extraia o estado emocional do usuário.
        3. Extraia o estado espiritual do usuário.
        4. Envie ele para os agentes que fizer sentido para obter uma resposta.
        5. Responda ao usuário com base na resposta dos agentes.

        Regras:
        - Se não houver intenções, diga a ele como você pode ajudar, liste todas suas habilidades e ofereça uma delas aleatóriamente.
        - Formate a mensagem com emojis e com linhas curtas quando:
          a) Você estiver falando sobre si mesmo.
        
        Resposta:`,
      },
    ],
    tools: {
      detectIntentionsTool,
      detectEmotionalState,
    },
  });

  const delay = Math.min(output.text.length * 100, 2700);
  console.log('Output:', {
    text: output.text,
    delay,
  });

  await sendText({
    text: output.text,
    phone: member.phone,
    delay,
  });

  runningIds.splice(runningIds.indexOf(member.id), 1);
}
