import { Document, Schema } from 'mongoose';

export const BalanceSchema = new Schema({
  _id: String, String,
  money: Number,
  __v: { type: Number, select: false },
});

export interface BalanceView extends Document {
  readonly _id: string;
  readonly money: number;
}

export const BALANCE_MODEL = 'BALANCE_MODEL';
