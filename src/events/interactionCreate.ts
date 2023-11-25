import { Event } from '@/classes/event.ts';
import { commands } from '@/modules/command.ts';

export default new Event({
  name: 'interactionCreate',
  once: false,

  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) return;

    await interaction.deferReply();
    await command.execute(interaction);
  },
});