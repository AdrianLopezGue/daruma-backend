import { Document, Schema } from 'mongoose';

export const ExpenseSchema = new Schema({
  _id: String,
  groupId: String,
  name: String,
  money: Number,
  currencyCode: String,
  payers: [String],
  debtors: [String],
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
  readonly payers: string[];
  readonly debtors: string[];
  readonly date: Date;
  readonly periodicity: string;
  readonly endPeriodicity: Date;
}

export const EXPENSE_MODEL = 'EXPENSE_MODEL';
