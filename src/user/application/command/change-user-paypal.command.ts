import { ICommand } from '@nestjs/cqrs';

export class ChangeUserPaypalCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly userpaypal: string,
  ) {}
}
