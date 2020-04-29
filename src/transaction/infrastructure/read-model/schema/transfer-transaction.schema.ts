import { Document, Schema } from 'mongoose';

export const TransferTransactionSchema = new Schema({
  _id: String,
  idSender: String,
  idBeneficiary: String,
  money: Number,
  currencyCode: String,
  idGroup: String,
  __v: { type: Number, select: false },
});

export interface TransferTransactionView extends Document {
  readonly _id: string;
  readonly idSender: string;
  readonly idBeneficiary: string;
  readonly money: number;
  readonly currencyCode: string;
  readonly idGroup: string;
}

export const TRANSFER_TRANSACTION_MODEL = 'TRANSFER_TRANSACTION_MODEL';
