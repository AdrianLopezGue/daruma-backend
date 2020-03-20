import { Document, Schema } from 'mongoose';

export const GroupSchema = new Schema({
  _id: String,
  name: String,
  currencyCode: String,
  idOwner: String,
  __v: { type: Number, select: false },
});

export interface GroupView extends Document {
  readonly _id: string;
  readonly name: string;
  readonly currencyCode: string;
  readonly idOwner: string;
}

export const GROUP_MODEL = 'GROUP_MODEL';
