import { Command } from '@/classes/command.ts';
import ansiColors from 'ansi-colors';
import consola from 'consola';
import { Collection, REST, Routes } from 'discord.js';
import { readdir } from 'fs/promises';

const { bold } = ansiColors;

export const commands: Collection<string, Command> = new Collection();
export const rest = new REST({ version: '10' }).setToken(process.env['TOKEN'] ?? '');

export async function reloadCommands() {
  const folderInputs = (
    await readdir('./src/commands', {
      encoding: 'utf-8',
      withFileTypes: true,
    })
  ).filter((dirent) => dirent.isDirectory());

  for await (const { name: folderName } of folderInputs) {
    const fileInputs = (
      await readdir(`./src/commands/${folderName}`, {
        encoding: 'utf-8',
        withFileTypes: true,
      })
    ).filter((dirent) => dirent.isFile());

    for await (const { name: fileName } of fileInputs) {
      const commandImport = await import(
        `../commands/${folderName}/${fileName}`
      );
      if (!(commandImport.default instanceof Command)) continue;

      const { default: commandData }: { default: Command } =
                commandImport;
      commands.set(commandData.build().name, commandData);
      consola.success(`Başarıyla ${bold(fileName)} adlı dosya komutlara kayıt edildi.`);
    }
  }

  await rest.put(Routes.applicationCommands(process.env['ID'] ?? ''), {
    body: commands.map((command) => command.build()),
  });
}
