import { constructFreetResponse, FreetResponse } from '../freet/util';
import type {HydratedDocument} from 'mongoose';
import type {Group, PopulatedGroup} from '../group/model';

// Update this if you add a property to the Group type!
type GroupResponse = {
  _id: string;
  name: string;
  administrators: string[];
  members: string[];
  posts: FreetResponse[];
  isPrivate: boolean;
};

/**
 * Transform a raw Group object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Group>} group - A group object
 * @returns {GroupResponse} - The group object with administrators' and members' names
 */
const constructGroupResponse = (group: HydratedDocument<Group>): GroupResponse => {
  const groupCopy: PopulatedGroup = {
    ...group.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const administrators = groupCopy.administrators.map((admin) => admin.username);
  const members = groupCopy.members.map((member) => member.username);
  delete groupCopy.administrators;
  delete groupCopy.members;
  return {
    ...groupCopy,
    _id: groupCopy._id.toString(),
    administrators: administrators,
    members: members,
    posts: groupCopy.posts.map(constructFreetResponse),
  };
};

export {
  constructGroupResponse
};
