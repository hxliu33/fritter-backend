import { Freet } from 'freet/model';
import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type { User } from 'user/model';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Group on the backend
export type Group = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string;
  administrators: [Types.ObjectId];
  members: [Types.ObjectId];
  posts: [Types.ObjectId];
  isPrivate: boolean;
};

export type PopulatedGroup = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string;
  administrators: User[];
  members: User[];
  posts: Freet[];
  isPrivate: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const GroupSchema = new Schema<Group>({
  // The group's name
  name: {
    type: String,
    required: true
  },
  // The group's administrators
  administrators: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'User'
  },
  // The group's members
  members: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'User'
  },
  // The group's posts
  posts: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'Freet'
  },
  // The group's privacy setting
  isPrivate: {
    type: Boolean,
    required: true,
  }
});

const GroupModel = model<Group>('Group', GroupSchema);
export default GroupModel;
