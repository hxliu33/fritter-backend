import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Group} from '../group/model';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for User on the backend
export type User = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  username: string;
  password: string;
  dateJoined: Date;
  groups?: [Types.ObjectId];
};

// Type definition for User on the backend
export type PopulatedUser = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  username: string;
  password: string;
  dateJoined: Date;
  groups?: [Group];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const UserSchema = new Schema({
  // The user's username
  username: {
    type: String,
    required: true
  },
  // The user's password
  password: {
    type: String,
    required: true
  },
  // The date the user joined
  dateJoined: {
    type: Date,
    required: true
  },
});

// (virtual-population)
// Auto-populate a User.groups field with any groups associated with this user such that User._id === Group.members._id
UserSchema.virtual('groups', {
  ref: 'Group',
  localField: '_id',
  foreignField: 'members'
});

UserSchema.set('toObject', {getters:true});
UserSchema.set('toJSON', {getters:true});
const UserModel = model<User>('User', UserSchema);
export default UserModel;
