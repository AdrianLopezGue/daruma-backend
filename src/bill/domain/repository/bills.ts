import { BillId } from '../model/bill-id';
import { Bill } from '../model/bill';
export interface Bills {
  find(billId: BillId): Promise<Bill> | null;
  get(billId: BillId): Promise<Bill>;
  save(bill: Bill): void;
}
