import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { EventStore } from '../../../core/eventstore/eventstore';
import { Payers } from '../../domain/repository/payers';
import { PayerId } from '../../domain/model/payer-id';
import { Payer } from '../../domain/model/payer';


@Injectable()
export class PayerEventStore implements Payers {
  constructor(
    private readonly eventStore: EventStore,
    private readonly publisher: EventPublisher,
  ) {}

  async get(payerId: PayerId): Promise<Payer> {
    return this.eventStore.read(Payer, payerId.value);
  }

  async find(payerId: PayerId): Promise<Payer> | null {
    return this.eventStore.read(Payer, payerId.value);
  }

  save(payer: Payer): void {
    payer = this.publisher.mergeObjectContext(payer);
    payer.commit();
  }
}