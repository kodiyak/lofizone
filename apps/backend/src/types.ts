export interface EvolutionWebhook<T> {
  event: string;
  instance: string;
  data: T;
  date_time: string;
  sender?: string;
  teamId: string;
  connectionId?: string;
}

export interface Evolution {
  'message.upsert': {
    key: {
      remoteJid: string;
      fromMe: boolean;
      id: string;
      participant?: string;
    };
    pushName: string;
    message: {
      conversation: string;
      messageContextInfo: {
        messageSecret: string;
      };
      [key: string]: any;
    };
    messageType: string;
    messageTimestamp: number;
    owner: string;
    source: string;
    [key: string]: any;
  };
}
