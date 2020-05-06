import { ICommand } from '@nestjs/cqrs';

export class ChangeCurrencyCodeBillsCommand implements ICommand {
  constructor(public readonly groupId: string, public readonly currencyCode: string) {}
}