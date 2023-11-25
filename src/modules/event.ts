import { bot } from '@/base/bot.ts';
import { Event } from '@/classes/event.ts';
import type { Categories } from '@/types.ts';
import ansiColors from 'ansi-colors';
import consola from 'consola';
import { Collection } from 'discord.js';
import { readdir } from 'fs/promises';

const { bold } = ansiColors;
export const events: Collection<Categories, Event[]> = new Collection();

export async function reloadEvents() {
  const fileInputs = (
    await readdir('./src/events', {
      encoding: 'utf-8',
      withFileTypes: true,
    })
  ).filter((dirent) => dirent.isFile());

  for await (const { name: fileName } of fileInputs) {
    const eventImport = await import(`../events/${fileName}`);
    if (!(eventImport.default instanceof Event)) continue;

    const { default: eventData }: { default: Event } = eventImport;
    const categories = events.get(eventData.name) ?? [];

    events.set(eventData.name, [...categories, eventData]);
    consola.success(
      `Başarıyla ${bold(fileName)} adlı dosya etkinliklere kayıt edildi.`,
    );
  }

  events.forEach((event) => {
    event.forEach((category) => {
      bot[category.once ? 'once' : 'on'](category.name, async (...args) => {
        category.execute(...args);
      });
    });
  });
}
