import { SlashCommandBuilder } from 'discord.js';
import { ICommandModule } from '../commandHandler';

const createForm: ICommandModule = {
  name: 'create-form',
  description: 'this is form creation command',
  notAllowedEnv: ['production', 'staging'],
  allowedServer: null,

  slashCommandConfig: new SlashCommandBuilder()
    .setName('create-form')
    .setDescription('Replies with Pong!'),
  execute: async function () {
    console.log('executeing form create command ->', Math.random() * 8);
  },
};

module.exports = createForm;
