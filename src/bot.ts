import { Client, Events, GatewayIntentBits } from 'discord.js';
import {
  restCommandHandler,
  slashCommandHandler,
} from './commands/commandHandler';

export const botInstance = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const allBotCommands = slashCommandHandler();
restCommandHandler();

botInstance.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = allBotCommands.get(interaction.commandName);

  if (!command) {
    return;
  }

  command.execute(interaction);
});

botInstance.once(Events.ClientReady, (client: Client<true>) => {
  console.log(
    `🔥 ${client.user.username} 🔥 is running in ${client.guilds.cache.size} servers.`
  );
});

export const startBot = (botToken: string) => {
  botInstance.login(botToken);
};
