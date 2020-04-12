import { Document, Schema } from 'mongoose';

export const DebtorSchema = new Schema({
  _id: String,
  expenseId: String,
  memberId: String,
  money: Number,
  currencyCode: String,
  __v: { type: Number, select: false },
});

export interface DebtorView extends Document {
  readonly _id: string;
  readonly expenseId: string;
  readonly memberId: string;
  readonly money: bigint;
  readonly currencyCode: string;
}

export const DEBTOR_MODEL = 'DEBTOR_MODEL';
