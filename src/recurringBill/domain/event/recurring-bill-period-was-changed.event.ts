import { DomainEvent } from '../../../core/domain/models/domain-event';

export class RecurringBillPeriodWasChanged implements DomainEvent {
  constructor(public readonly id: string, public readonly date: Date, public readonly period: number) {}
}