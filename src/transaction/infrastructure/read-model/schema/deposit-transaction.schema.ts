import { Document, Schema } from 'mongoose';

export const DepositTransactionSchema = new Schema({
  _id: String,
  idMember: String,
  idBill: String,
  money: Number,
  currencyCode: String,
  __v: { type: Number, select: false },
});

export interface DepositTransactionView extends Document {
  readonly _id: string;
  readonly idMember: string;
  readonly idBill: string;
  readonly money: number;
  readonly currencyCode: string;
}

export const DEPOSIT_TRANSACTION_MODEL = 'DEPOSIT_TRANSACTION_MODEL';