import { Document, Schema } from 'mongoose';
import { BillPayer } from '../../../domain/model/bill-payer';
import { BillDebtor } from '../../../domain/model/bill-debtor';

export const BillSchema = new Schema({
  _id: String,
  groupId: String,
  name: String,
  money: Number,
  currencyCode: String,
  date: Date,
  payers: [ {id: String, amount: Number}],
  debtors: [ {id: String, amount: Number}],
  creatorId: String,
  __v: { type: Number, select: false },
});

export interface BillView extends Document {
  readonly _id: string;
  readonly groupId: string;
  readonly name: string;
  readonly money: bigint;
  readonly currencyCode: string;
  readonly date: Date;
  readonly payers: BillPayer[];
  readonly debtors: BillDebtor[];
  readonly creatorId: string;
}

export const BILL_MODEL = 'BILL_MODEL';
