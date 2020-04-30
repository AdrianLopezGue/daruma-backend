
import { DomainEvent } from '../../../core/domain/models/domain-event';

export class TransferTransactionWasRemoved implements DomainEvent {
  constructor(public readonly id: string) {}
}