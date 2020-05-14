import { Document, Schema } from 'mongoose';

export const RecurringBillSchema = new Schema({
  _id: String,
  billId: String,
  groupId: String,
  nextCreationDate: Date,
  period: Number,
  __v: { type: Number, select: false },
});

export interface RecurringBillView extends Document {
  readonly _id: string;
  readonly billId: string;
  readonly groupId: string;
  readonly nextCreationDate: Date;
  readonly period: number;
}

export const RECURRING_BILL_MODEL = 'RECURRING_BILL_MODEL';
