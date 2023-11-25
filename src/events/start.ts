import { Event } from '@/classes/event.ts';
import consola from 'consola';

export default new Event({
  name: 'ready',

  async execute() {
    consola.success('Bot başarıyla Discord\'a giriş yaptı.');
  },
});