import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { EventStore } from '../../../core/eventstore/eventstore';
import { DebtorId } from '../../domain/model/debtor-id';
import { Debtor } from '../../domain/model/debtor';
import { Debtors } from '../../domain/repository/debtors';

@Injectable()
export class DebtorEventStore implements Debtors {
  constructor(
    private readonly eventStore: EventStore,
    private readonly publisher: EventPublisher,
  ) {}

  async get(debtorId: DebtorId): Promise<Debtor> {
    return this.eventStore.read(Debtor, debtorId.value);
  }

  async find(debtorId: DebtorId): Promise<Debtor> | null {
    return this.eventStore.read(Debtor, debtorId.value);
  }

  save(debtor: Debtor): void {
    debtor = this.publisher.mergeObjectContext(debtor);
    debtor.commit();
  }
}
