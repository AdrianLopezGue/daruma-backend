import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { EventStore } from '../../../core/eventstore/eventstore';
import { RecurringBills } from '../../domain/repository/recurring-bills';
import { RecurringBill } from '../../domain/model/recurring-bill';
import { RecurringBillId } from '../../domain/model/recurring-bill-id';

@Injectable()
export class RecurringBillEventStore implements RecurringBills {
  constructor(
    private readonly eventStore: EventStore,
    private readonly publisher: EventPublisher,
  ) {}

  async get(recurringBillId: RecurringBillId): Promise<RecurringBill> {
    return this.eventStore.read(RecurringBill, recurringBillId.value);
  }

  async find(recurringBillId: RecurringBillId): Promise<RecurringBill> | null {
    return this.eventStore.read(RecurringBill, recurringBillId.value);
  }

  save(recurringBill: RecurringBill): void {
    recurringBill = this.publisher.mergeObjectContext(recurringBill);
    recurringBill.commit();
  }
}