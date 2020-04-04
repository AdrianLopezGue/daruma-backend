import { ICommand } from '@nestjs/cqrs';

export class RegisterMemberAsUserCommand implements ICommand {
  constructor(public readonly memberId: string, public readonly userId: string) {}
}
