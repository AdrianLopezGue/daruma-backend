import { ReceiptId } from '../model/receipt-id';
import { Receipt } from '../model/receipt';

export interface Receipts {
  find(receiptId: ReceiptId): Promise<Receipt> | null;
  get(receiptId: ReceiptId): Promise<Receipt>;
  save(receipt: Receipt): void;
}