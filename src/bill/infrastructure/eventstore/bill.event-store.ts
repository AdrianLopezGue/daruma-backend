import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { EventStore } from '../../../core/eventstore/eventstore';
import { Bills } from '../../domain/repository/bills';
import { BillId } from '../../domain/model/bill-id';
import { Bill } from '../../domain/model/bill';

@Injectable()
export class BillEventStore implements Bills {
  constructor(
    private readonly eventStore: EventStore,
    private readonly publisher: EventPublisher,
  ) {}

  async get(billId: BillId): Promise<Bill> {
    return this.eventStore.read(Bill, billId.value);
  }

  async find(billId: BillId): Promise<Bill> | null {
    return this.eventStore.read(Bill, billId.value);
  }

  save(bill: Bill): void {
    bill = this.publisher.mergeObjectContext(bill);
    bill.commit();
  }
}
