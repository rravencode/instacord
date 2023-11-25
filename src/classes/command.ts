import type { CommandOption } from '@/types.ts';
import { SlashCommandBuilder } from 'discord.js';

export class Command {
  private commandData: CommandOption;

  constructor(commandData: CommandOption) {
    this.commandData = commandData;
  }

  public get data() {
    return this.commandData.data;
  }

  public get execute() {
    return this.commandData.execute;
  }

  public get cooldownTime() {
    return this.commandData.cooldownTime ?? 3;
  }

  public build(slashCommandBuilder?: SlashCommandBuilder) {
    if (typeof this.commandData.data === 'function') {
      return this.commandData.data(slashCommandBuilder ?? new SlashCommandBuilder());
    }
    else {
      return this.commandData.data;
    }
  }
}