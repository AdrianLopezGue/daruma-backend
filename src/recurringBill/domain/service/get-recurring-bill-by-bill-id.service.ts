import { BillId } from '../../../bill/domain/model/bill-id';

export interface GetRecurringBillIdByBillId {
  with(billId: BillId): Promise<string[]>;
}

export const GET_RECURRING_BILL_ID_BY_BILL_ID =
  'GET_RECURRING_BILL_ID_BY_BILL_ID';
