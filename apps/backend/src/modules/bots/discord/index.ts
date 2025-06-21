import { env } from '@/env';
import { REST, Routes, Client, GatewayIntentBits, Events, Interaction } from 'discord.js';

export async function registerDiscordBot() {
  await registerCommands();
  await startDiscordBot();
}

async function registerCommands() {
  const commands = [
    {
      name: 'ping',
      description: 'Replies with Pong!',
    },
  ];

  const rest = new REST({ version: '10' }).setToken(env.discordToken);
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(env.discordClientId), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

async function startDiscordBot() {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds], // Intents necessários pra slash commands
  });

  client.once(Events.ClientReady, () => {
    console.log(`✅ Bot logado como ${client.user?.tag}`);
  });

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, user } = interaction;

    if (commandName === 'ping') {
      console.log(`🔔 ${user.tag} usou o comando /ping`, user);
      await interaction.reply('🏓 Pong!');
    }
  });

  await client.login(env.discordToken);
}
