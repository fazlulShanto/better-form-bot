import { SlashCommandBuilder } from 'discord.js';

export const serverInfo = {
  name: 'server-info',
  description: 'get server related info',
  slashCommandConfig: new SlashCommandBuilder()
    .setName('server-info')
    .setDescription('Replies with Pong!'),
  execute: async function () {
    console.log('executeing server info', Math.random() * 8);
  },
};

module.exports = serverInfo;
