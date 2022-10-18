import type {Request, Response} from 'express';
import express from 'express';
import GroupCollection from '../group/collection';
import UserCollection from './collection';
import * as groupValidator from '../group/middleware';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Create a group.
 *
 * @name POST /api/groups
 *
 * @param {string} name - name of group
 * @return {GroupResponse} - The created group
 * @throws {403} - If the user is not logged in
 * @throws {409} - If name is already taken
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    groupValidator.isNameNotAlreadyInUse
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const group = await GroupCollection.addOne(req.body.name, userId);

    res.status(201).json({
      message: 'Your group was created successfully.',
      group: util.constructGroupResponse(group)
    });
  }
);

export {router as groupRouter};
