import type { Categories, EventOption } from '@/types.ts';

export class Event<Category extends Categories = Categories> {
  private eventData: EventOption<Category>;

  constructor(eventData: EventOption<Category>) {
    this.eventData = eventData;
  }

  public get name() {
    return this.eventData.name;
  }

  public get once() {
    return this.eventData.once ?? false;
  }

  public get execute() {
    return this.eventData.execute;
  }
}