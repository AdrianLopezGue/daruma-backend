import { ICommand } from '@nestjs/cqrs';

export class ChangeGroupCurrencyCodeCommand implements ICommand {
  constructor(
    public readonly groupId: string,
    public readonly currencyCode: string,
  ) {}
}
