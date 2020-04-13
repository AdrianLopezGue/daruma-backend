import { Document, Schema } from 'mongoose';

export const ReceiptSchema = new Schema({
  _id: String,
  expenseId: String,
  date: Date,
  payers: [String],
  debtors: [String],
  money: Number,
  currencyCode: String,
  __v: { type: Number, select: false },
});

export interface ReceiptView extends Document {
  readonly _id: string;
  readonly expenseId: string;
  readonly date: Date;
  readonly payers: string[];
  readonly debtors: string[];
  readonly money: bigint;
  readonly currencyCode: string;
}

export const RECEIPT_MODEL = 'RECEIPT_MODEL';