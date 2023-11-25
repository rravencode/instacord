import { reloadCommands } from '@/modules/command.ts';
import { reloadEvents } from '@/modules/event.ts';
import { Client, GatewayIntentBits } from 'discord.js';

export const bot = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [],
  rest: {
    offset: 0,
  },
  ws: {
    large_threshold: 250,
  },
});

export async function start() {
  try {
    await reloadCommands();
    await reloadEvents();

    await bot.login(process.env['TOKEN']);
  }
  catch (error) {
    console.log(error);
  }
}
