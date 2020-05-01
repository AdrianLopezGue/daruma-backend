import { ICommand } from '@nestjs/cqrs';

export class RemoveMemberCommand implements ICommand {
  constructor(public readonly memberId: string) {}
}