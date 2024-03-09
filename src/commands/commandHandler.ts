import {
  ChatInputCommandInteraction,
  Collection,
  REST,
  RESTPostAPIApplicationCommandsResult,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
  SlashCommandBuilder,
} from 'discord.js';
import fs from 'fs';
import path from 'path';

// to add a new command to the bot add the command name here
const newCommandsToRegister = ['test'];
const shouldRefreshAllCommands = true;

export interface ICommandModule {
  name: string;
  notAllowedEnv: TNotAllowedEnvironments[];
  allowedServer: TAllowedServer;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  slashCommandConfig: SlashCommandBuilder;
  description: string;
}

export type TNotAllowedEnvironments = 'dev' | 'production' | 'staging';

export type TAllowedServer = string[] | null;

const readSubFolder = (obj: string) => {
  // console.log(obj)
  const pathName = path.join(__dirname, obj);
  const fileList = fs
    .readdirSync(pathName, {
      withFileTypes: true,
    })
    .filter((v: any) => v.isFile() && v.name.endsWith('.ts'))
    .map((v: any) => path.join(pathName, v.name));
  return fileList;
};

const readFolder = (folderPath: any = '') => {
  const fileList = fs
    .readdirSync(__dirname, {
      withFileTypes: true,
    })
    .filter((v) => v.isDirectory())
    .map((v) => readSubFolder(v.name))
    .flat();
  return fileList;
};

export const slashCommandHandler = () => {
  const commandCollection = new Collection<string, ICommandModule>();
  // readFolder('others')
  const fileList = readFolder();

  for (let i = 0; i < fileList.length; i++) {
    const command = require(fileList[i]);

    commandCollection.set(command.name, command);
  }
  return commandCollection;
};

interface ExtendedSlashCommandBuilder {
  rawBody: RESTPostAPIChatInputApplicationCommandsJSONBody;
  //   allowedServers: TAllowedServer;
  notAllowedEnvironments: TNotAllowedEnvironments[];
}
/**
 * @description responsible for registering NEW commands in discord api
 */

export const restCommandHandler = async () => {
  const currentEnvironment = process.env.NODE_ENV as TNotAllowedEnvironments;
  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  const BOT_ID = process.env.DISCORD_BOT_ID;

  const commands: ExtendedSlashCommandBuilder[] = [];

  const commandFiles = readFolder();

  for (const file of commandFiles) {
    const command = require(file) as ICommandModule;
    commands.push({
      rawBody:
        command.slashCommandConfig.toJSON() as RESTPostAPIChatInputApplicationCommandsJSONBody,
      notAllowedEnvironments: command.notAllowedEnv,
    });
  }

  const rest = new REST({ version: '10' }).setToken(BOT_TOKEN!);
  const registered = [];

  console.log(
    `Started refreshing ${commands.length} application (/) commands.`
  );

  try {
    for await (const cmd of commands) {
      registered.push(cmd);

      const shouldIgnore =
        (!newCommandsToRegister.includes(cmd.rawBody.name) ||
          cmd.notAllowedEnvironments.includes(currentEnvironment)) &&
        !shouldRefreshAllCommands;

      if (shouldIgnore) {
        continue;
      }

      const data = (await rest.post(
        //   Routes.applicationGuildCommands(BOT_ID!, serverId),
        Routes.applicationCommands(BOT_ID!),
        { body: cmd.rawBody }
      )) as RESTPostAPIApplicationCommandsResult;
    }

    console.log(
      `Successfully registered ${registered.length}/${commands.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
};
