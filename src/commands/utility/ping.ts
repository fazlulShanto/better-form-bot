import { SlashCommandBuilder } from 'discord.js';
import { ICommandModule } from '../commandHandler';

const pingCommand: ICommandModule = {
  name: 'ping',

  description: 'this is ping command',

  notAllowedEnv: ['production', 'staging'],

  allowedServer: null,

  slashCommandConfig: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('I am alive v2'),

  execute: async function (interaction) {
    const randomPing = Math.random() * 103;
    interaction.reply(`you ping is ->: ${randomPing}`);
  },
};
module.exports = pingCommand;
