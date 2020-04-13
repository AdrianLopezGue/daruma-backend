import { ICommand } from '@nestjs/cqrs';
import { ParticipantDto } from '../../infrastructure/dto/expense.dto';

export class CreateExpenseCommand implements ICommand {
  constructor(
    public readonly expenseId: string,
    public readonly groupId: string,
    public readonly name: string,
    public readonly money: bigint,
    public readonly currencyCode: string,
    public readonly payers: ParticipantDto[],
    public readonly debtors: ParticipantDto[],
    public readonly date: Date,
    public readonly periodicity: string,
    public readonly endPeriodicity: Date,
  ) {}
}
