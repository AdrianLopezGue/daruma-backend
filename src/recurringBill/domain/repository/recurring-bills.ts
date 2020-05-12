import { RecurringBillId } from '../model/recurring-bill-id';
import { RecurringBill } from '../model/recurring-bill';

export interface RecurringBills {
  find(recurringBillId: RecurringBillId): Promise<RecurringBill> | null;
  get(recurringBillId: RecurringBillId): Promise<RecurringBill>;
  save(recurringBill: RecurringBill): void;
}

export const RECURRING_BILLS = 'RECURRING_BILLS';
