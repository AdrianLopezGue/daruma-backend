import { DomainEvent } from '../../../core/domain';
import { BillDebtor } from '../model/bill-debtor';
import { BillPayer } from '../model/bill-payer';

export class BillWasCreated implements DomainEvent {
  constructor(
    public readonly id: string,
    public readonly groupId: string,
    public readonly name: string,
    public readonly money: number,
    public readonly currencyCode: string,
    public readonly date: Date,
    public readonly payers: BillPayer[],
    public readonly debtors: BillDebtor[],
    public readonly creatorId: string,
  ) {}
}
