import type {
  ChatInputCommandInteraction,
  ClientEvents,
  ClientOptions,
  SlashCommandBuilder,
} from 'discord.js';

export type slashCommandBuilder = SlashCommandBuilder;
export type Categories = keyof ClientEvents;
export type MaybePromise<Type> = Type | Promise<Type>;
export type ReplacerValue = string | number;

export interface ConfigData {
    id: string;
    token: string;
    databaseUri: string;
    webhookUrl: string;
    developers: string[];
    intents: ClientOptions['intents'];
    restOffset: number;
    largeThreshold: number;
}

export interface EventOption<Category extends Categories> {
    name: Category;
    once?: boolean;
    execute: (...args: ClientEvents[Category]) => MaybePromise<any>;
}

export interface CommandOption {
    cooldownTime?: boolean;
    data: (
        builder: slashCommandBuilder,
    ) =>
        | slashCommandBuilder
        | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
    execute: (interaction: ChatInputCommandInteraction) => MaybePromise<void>;
}
