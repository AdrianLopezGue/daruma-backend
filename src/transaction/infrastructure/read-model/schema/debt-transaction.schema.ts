import { Document, Schema } from 'mongoose';

export const DebtTransactionSchema = new Schema({
  _id: String,
  idMember: String,
  idBill: String,
  money: Number,
  currencyCode: String,
  __v: { type: Number, select: false },
});

export interface DebtTransactionView extends Document {
  readonly _id: string;
  readonly idMember: string;
  readonly idBill: string;
  readonly money: number;
  readonly currencyCode: string;
}

export const DEBT_TRANSACTION_MODEL = 'DEBT_TRANSACTION_MODEL';
