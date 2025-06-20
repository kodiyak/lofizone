import { ElevenLabsClient } from 'elevenlabs';
import { env } from '../../env';

export const elevenLabsClient = new ElevenLabsClient({
  apiKey: env.elevenLabsApiKey!,
});
