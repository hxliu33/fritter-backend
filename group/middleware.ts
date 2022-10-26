import type {Request, Response, NextFunction} from 'express';
import FreetCollection from '../freet/collection';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import GroupCollection from '../group/collection';

/**
 * Checks if a name in req.body is already in use
 */
const isNameNotAlreadyInUse = async (req: Request, res: Response, next: NextFunction) => {
  const group = await GroupCollection.findOneByName(req.body.name);

  if (!group) {
    next();
    return;
  }

  res.status(409).json({
    error: {
      username: 'A group with this name already exists.'
    }
  });

  next();
};

/**
 * Checks if a group with groupId in req.params exists
 */
const isGroupExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.groupId) {
    res.status(400).json({
      error: 'Provided group ID must be nonempty.'
    });
    return;
  }

  const group = await GroupCollection.findOneByName(req.params.groupId as string);
  if (!group) {
    res.status(404).json({
      error: `A group with groupId ${req.params.groupId as string} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the privacy setting of the group in req.body is valid, i.e empty space or a boolean "true"/"false"
 */
 const isValidPrivacySetting = (req: Request, res: Response, next: NextFunction) => {
  const {isPrivate} = req.body as {isPrivate: string};

  if (isPrivate !== "true" && isPrivate !== "false" && isPrivate.trim()) {
    res.status(412).json({
      error: 'Privacy setting must be a boolean value true or false.'
    });
    return;
  }

  next();
};

/**
 * Checks if the privacy setting of the group in req.query is valid, i.e empty space or a boolean "true"/"false"
 */
 const isValidPrivacySettingQuery = (req: Request, res: Response, next: NextFunction) => {
  if (req.query.isPrivate === undefined) {
    res.status(400).json({
      error: 'Privacy setting must be present.'
    })
  }
  
  const {isPrivate} = req.query as {isPrivate: string};

  if (isPrivate !== "true" && isPrivate !== "false" && isPrivate.trim()) {
    res.status(412).json({
      error: 'Privacy setting must be a boolean value true or false.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is a member of the group
 */
 const isUserMember = async (req: Request, res: Response, next: NextFunction) => {
  const {groupId} = req.params as {groupId: string};
  const group = await GroupCollection.findOneByGroupId(groupId);

  const validFormat = Types.ObjectId.isValid(req.body.userId);
  if (!validFormat) {
    res.status(400).json({
      error: 'Not valid user ID format.'
    });
    return;
  }
  if (!group.members.includes(req.session.userId as Types.ObjectId)) {
    res.status(403).json({
      error: 'User must be a member of the group.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user given by userId in req.body is a member of the group
 */
 const isGivenUserMember = async (req: Request, res: Response, next: NextFunction) => {
  const {groupId} = req.params as {groupId: string};
  const group = await GroupCollection.findOneByGroupId(groupId);

  const validFormat = Types.ObjectId.isValid(req.body.userId);
  if (!validFormat) {
    res.status(400).json({
      error: 'Not valid user ID format.'
    });
    return;
  }
  if (!group.members.includes(req.body.userId as Types.ObjectId)) {
    res.status(403).json({
      error: 'User must be a member of the group.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user given by userId in req.body is NOT a member of the group
 */
 const isGivenUserNotMember = async (req: Request, res: Response, next: NextFunction) => {
  const {groupId} = req.params as {groupId: string};
  const group = await GroupCollection.findOneByGroupId(groupId);

  const validFormat = Types.ObjectId.isValid(req.body.userId);
  if (!validFormat) {
    res.status(400).json({
      error: 'Not valid user ID format.'
    });
    return;
  }
  if (group.members.includes(req.body.userId as Types.ObjectId)) {
    res.status(409).json({
      error: 'User is already a member of the group.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is an admin of the group
 */
 const isUserAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const {groupId} = req.params as {groupId: string};
  const group = await GroupCollection.findOneByGroupId(groupId);

  const validFormat = Types.ObjectId.isValid(req.body.userId);
  if (!validFormat) {
    res.status(400).json({
      error: 'Not valid user ID format.'
    });
    return;
  }
  if (!group.administrators.includes(req.session.userId as Types.ObjectId)) {
    res.status(403).json({
      error: 'User must be an admin of the group.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user given by userId in req.body is an admin of the group
 */
 const isGivenUserAdminAlready = async (req: Request, res: Response, next: NextFunction) => {
  const {groupId} = req.params as {groupId: string};
  const group = await GroupCollection.findOneByGroupId(groupId);

  const validFormat = Types.ObjectId.isValid(req.body.userId);
  if (!validFormat) {
    res.status(400).json({
      error: 'Not valid user ID format.'
    });
    return;
  }
  if (group.administrators.includes(req.body.userId as Types.ObjectId)) {
    res.status(409).json({
      error: 'User is already an admin of the group.'
    });
    return;
  }

  next();
};

/**
 * Checks if userId given in req.body belongs to an existing user
 */
const isUserExists = async (req: Request, res: Response, next: NextFunction) => {
  const {userId} = req.body as {userId: string};
  if (!userId) {
    res.status(400).json({error: `Missing userId.`});
    return;
  }
  const user = await UserCollection.findOneByUserId(req.body.userId as string);
  if (!user) {
    res.status(404).json({
      error: `A user with ID ${req.body.userId as string} does not exist.`
    });
    return;
  }

  next();
}

/**
 * Checks if a freet with freetId in req.body exists
 */
 const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.freetId);
  const freet = validFormat ? await FreetCollection.findOne(req.body.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.body.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with freetId in req.body is already in the group
 */
 const isFreetInGroup = async (req: Request, res: Response, next: NextFunction) => {
  const {groupId} = req.params as {groupId: string};
  const group = await GroupCollection.findOneByGroupId(groupId);

  if (group.posts.includes(req.body.freetId as Types.ObjectId)) {
    res.status(409).json({
      error: `Freet with freet ID ${req.body.freetId} already exists in group.`
    });
    return;
  }

  next();
};

export {
  isNameNotAlreadyInUse,
  isGroupExists,
  isValidPrivacySetting,
  isValidPrivacySettingQuery,
  isUserMember,
  isGivenUserMember,
  isGivenUserNotMember,
  isUserAdmin,
  isGivenUserAdminAlready,
  isUserExists,
  isFreetExists,
  isFreetInGroup,
};
