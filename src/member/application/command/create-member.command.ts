import { ICommand } from '@nestjs/cqrs';

export class CreateMemberCommand implements ICommand {
  constructor(
    public readonly memberId: string,
    public readonly groupId: string,
    public readonly name: string,
    public readonly userId: string,
  ) {}
}
