import { ICommand } from '@nestjs/cqrs';

export class ChangeBillNameCommand implements ICommand {
  constructor(public readonly billId: string, public readonly name: string) {}
}
