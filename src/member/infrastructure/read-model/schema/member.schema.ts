import { Document, Schema } from 'mongoose';

export const MemberSchema = new Schema({
  _id: String,
  groupId: String,
  name: String,
  email: String,
  userId: String,
  __v: { type: Number, select: false },
});

export interface MemberView extends Document {
  readonly _id: string;
  readonly groupId: string;
  readonly name: string;
  readonly email: string;
  readonly userId: string;
}

export const MEMBER_MODEL = 'MEMBER_MODEL';