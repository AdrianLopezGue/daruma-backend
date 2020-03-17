import { ICommand } from '@nestjs/cqrs';

export class RegisterUserCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly username: string,
    public readonly useremail: string
  ) {}
}