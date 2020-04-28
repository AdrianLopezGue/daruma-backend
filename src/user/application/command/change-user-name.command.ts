import { ICommand } from '@nestjs/cqrs';

export class ChangeUserNameCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly username: string,
  ) {}
}
