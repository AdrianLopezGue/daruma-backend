
import { DomainEvent } from '../../../core/domain/models/domain-event';

export class DepositTransactionWasRemoved implements DomainEvent {
  constructor(public readonly id: string, public readonly idMember: string, public readonly money: number) {}
}