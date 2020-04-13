import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { EventStore } from '../../../core/eventstore/eventstore';
import { Receipts } from '../../domain/repository/receipts';
import { ReceiptId } from '../../domain/model/receipt-id';
import { Receipt } from '../../domain/model/receipt';

@Injectable()
export class ReceiptEventStore implements Receipts {
  constructor(
    private readonly eventStore: EventStore,
    private readonly publisher: EventPublisher,
  ) {}

  async get(receiptId: ReceiptId): Promise<Receipt> {
    return this.eventStore.read(Receipt, receiptId.value);
  }

  async find(receiptId: ReceiptId): Promise<Receipt> | null {
    return this.eventStore.read(Receipt, receiptId.value);
  }

  save(receipt: Receipt): void {
    receipt = this.publisher.mergeObjectContext(receipt);
    receipt.commit();
  }
}
