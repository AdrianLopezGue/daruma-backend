import { Document, Schema } from 'mongoose';

export const UserSchema = new Schema({
  _id: String,
  name: String,
  email: String,
  __v: { type: Number, select: false },
});

export interface UserView extends Document {
  readonly _id: string;
  readonly name: string;
  readonly email: string;
}

export const USER_MODEL = 'USER_MODEL';
