import { DomainEvent } from '../../../core/domain';

export class RecurringBillWasCreated implements DomainEvent {
  public constructor(
    public readonly id: string,
    public readonly billId: string,
    public readonly date: Date,
    public readonly period: number,
  ) {}
}
