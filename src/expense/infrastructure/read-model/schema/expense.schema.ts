import { Document, Schema } from 'mongoose';

export const ExpenseSchema = new Schema({
  _id: String,
  groupId: String,
  name: String,
  money: Number,
  currencyCode: String,
  date: Date,
  periodicity: String,
  endPeriodicity: Date,
  __v: { type: Number, select: false },
});

export interface ExpenseView extends Document {
  readonly _id: string;
  readonly groupId: string;
  readonly name: string;
  readonly money: bigint;
  readonly currencyCode: string;
  readonly date: Date;
  readonly periodicity: string;
  readonly endPeriodicity: Date;
}

export const EXPENSE_MODEL = 'EXPENSE_MODEL';
