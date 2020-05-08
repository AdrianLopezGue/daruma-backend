import { DomainEvent } from '../../../core/domain/models/domain-event';
import { BillDebtor } from '../model/bill-debtor';

export class BillDebtorWasAdded implements DomainEvent {
  constructor(public readonly id: string, public readonly debtor: BillDebtor) {}
}