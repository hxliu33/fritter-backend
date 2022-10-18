import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
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
};

/**
 * Checks if a group with groupId in req.query exists
 */
const isGroupExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.groupId) {
    res.status(400).json({
      error: 'Provided group ID must be nonempty.'
    });
    return;
  }

  const group = await GroupCollection.findOneByName(req.query.groupId as string);
  if (!group) {
    res.status(404).json({
      error: `A group with groupId ${req.query.groupId as string} does not exist.`
    });
    return;
  }

  next();
};

export {
  isNameNotAlreadyInUse,
  isGroupExists,
};
