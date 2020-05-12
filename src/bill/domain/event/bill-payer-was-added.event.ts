import { DomainEvent } from '../../../core/domain/models/domain-event';
import { BillPayer } from '../model/bill-payer';

export class BillPayerWasAdded implements DomainEvent {
  constructor(public readonly id: string, public readonly payer: BillPayer) {}
}
