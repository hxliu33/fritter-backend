import type {HydratedDocument, Types} from 'mongoose';
import type {Group} from './model';
import GroupModel from './model';
import UserCollection from '../user/collection';
import mongoose from 'mongoose';
import FreetCollection from '../freet/collection';

/**
 * This file contains a class with functionality to interact with groups stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<Group> is the output of the GroupModel() constructor,
 * and contains all the information in Group. https://mongoosejs.com/docs/typescript.html
 */
class GroupCollection {
  /**
   * Add a new group
   *
   * @param {string} name - The name of the group
   * @param {string} creator - The creator of the group
   * @return {Promise<HydratedDocument<Group>>} - The newly created group
   */
  static async addOne(name: string, creator: string | Types.ObjectId): Promise<HydratedDocument<Group>> {
    const group = new GroupModel({
      name: name,
      administrators: [creator],
      members: [creator],
      posts: [],
    });
    await group.save(); // Saves group to MongoDB
    return group.populate('administrators members posts');
  }

  /**
   * Find a group by groupId.
   *
   * @param {string} groupId - The groupId of the group to find
   * @return {Promise<HydratedDocument<Group>> | Promise<null>} - The group with the given groupId, if any
   */
  static async findOneByGroupId(groupId: Types.ObjectId | string): Promise<HydratedDocument<Group>> {
    return GroupModel.findOne({_id: groupId}).populate('administrators members posts');
  }

  /**
   * Find a group by name (case insensitive).
   *
   * @param {string} name - The name of the group to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The group with the given name, if any
   */
  static async findOneByName(name: string): Promise<HydratedDocument<Group>> {
    return GroupModel.findOne({name: new RegExp(`^${name.trim()}$`, 'i')}).populate('administrators members posts');
  }

  /**
   * Update a group with a new post
   *
   * @param {string} groupId - The groupId of the group to update
   * @param {string} freetId - The freet to be added to the group
   * @return {Promise<HydratedDocument<Group>>} - The newly updated group
   */
   static async updateOnePost(groupId:Types.ObjectId | string, freetId: string | Types.ObjectId): Promise<HydratedDocument<Group>> {
    const group = await GroupModel.findOne({_id: groupId});
    const freet = await FreetCollection.findOne(freetId);
    group.posts.push(freet._id);
    await group.save();
    return group.populate('administrators members posts');
  }

  /**
   * Update a group with a new member
   *
   * @param {string} groupId - The groupId of the group to update
   * @param {string} memberId - The user to be added to the group
   * @return {Promise<HydratedDocument<Group>>} - The newly updated group
   */
   static async updateOneMember(groupId:Types.ObjectId | string, memberId: string | Types.ObjectId): Promise<HydratedDocument<Group>> {
    const group = await GroupModel.findOne({_id: groupId});
    const user = await UserCollection.findOneByUserId(memberId);
    group.members.push(user._id);
    await group.save();
    return group.populate('administrators members');
  }

  /**
   * Update a group with a new adminiatrator
   *
   * @param {string} groupId - The groupId of the group to update
   * @param {string} adminId - The user to be added as admin to the group
   * @return {Promise<HydratedDocument<Group>>} - The newly updated group
   */
   static async updateOneAdministrator(groupId:Types.ObjectId | string, adminId: string | Types.ObjectId): Promise<HydratedDocument<Group>> {
    const group = await GroupModel.findOne({_id: groupId});
    const user = await UserCollection.findOneByUserId(adminId);
    group.members.push(user._id);
    await group.save();
    return group.populate('administrators members');
  }

}

export default GroupCollection;
