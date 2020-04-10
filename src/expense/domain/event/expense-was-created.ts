
import { DomainEvent } from '../../../core/domain';

export class ExpenseWasCreated implements DomainEvent {
  constructor(
    public readonly id: string,
    public readonly groupId: string,
    public readonly name: string,
    public readonly money: bigint,
    public readonly currencyCode: string,
    public readonly payers: string[],
    public readonly debtors: string[],
    public readonly date: Date,
    public readonly periodicity: string,
    public readonly endPeriodicity: Date,
  ) {}
}