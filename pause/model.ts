import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in Pause
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Pause on the backend
export type Pause = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: Types.ObjectId;
  minutesActive: number;
  threshold: number;
};

export type PopulatedPause = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: User;
  minutesActive: number;
  threshold: number;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Pauses stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const PauseSchema = new Schema<Pause>({
  // The user the pause settings belong to
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // The number of minutes the user has been active in this session
  minutesActive: {
    type: Number,
    required: true,
    min: [0, 'Minutes active cannot be negative!'],
  },
  // The threshold of time the user wants the pause notification to pop up after
  threshold: {
    type: Number,
    required: true,
    min: [0, 'Threshold cannot be negative!'],
  }
});

PauseSchema.index({ user: 1 }, { unique: true });

const PauseModel = model<Pause>('Pause', PauseSchema);
export default PauseModel;
