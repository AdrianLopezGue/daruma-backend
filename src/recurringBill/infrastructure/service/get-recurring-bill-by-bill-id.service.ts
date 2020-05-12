import { Inject, Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { RecurringBillView, RECURRING_BILL_MODEL } from '../read-model/schema/recurring-bill.schema';
import { BillId } from '../../../bill/domain/model/bill-id';
import { GetRecurringBillIdByBillId } from '../../domain/service/get-recurring-bill-by-bill-id.service';

@Injectable()
export class GetRecurringBillIdByBillIdFromReadModel implements GetRecurringBillIdByBillId {
  constructor(
    @Inject(RECURRING_BILL_MODEL) private readonly recurringBillModel: Model<RecurringBillView>,
  ) {}

  async with(billId: BillId): Promise<string[]> {
    return this.recurringBillModel.distinct('_id', { billId: billId.value }).exec();
  }
}