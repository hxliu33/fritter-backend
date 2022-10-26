import type {Request, Response} from 'express';
import express from 'express';
import GroupCollection from '../group/collection';
import * as groupValidator from '../group/middleware';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all groups that the user is a member of
 *
 * @name GET /api/groups/member
 *
 * @return {GroupResponse[]} - A list of groups that the user is member of
 * @throws {403} - If user is not logged in
 */
 router.get(
  '/member',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const allGroups = await GroupCollection.findAllByMember(req.session.userId as string);
    const response = allGroups.map(util.constructGroupResponse);
    res.status(200).json(response);
  }
);

/**
 * Get all groups that the user is an admin of
 *
 * @name GET /api/groups/admin
 *
 * @return {GroupResponse[]} - A list of groups that the user is admin of
 * @throws {403} - If user is not logged in
 *
 */
 router.get(
  '/admin',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const allGroups = await GroupCollection.findAllByAdmin(req.session.userId as string);
    const response = allGroups.map(util.constructGroupResponse);
    res.status(200).json(response);
  }
);

/**
 * Get information about a group
 *
 * @name GET /api/groups/:groupId
 *
 * @return {GroupResponse} - A group with id of groupId
 * @throws {403} - If user is not logged in
 * @throws {404} - If the groupId is not found
 * @throws {403} - If the user is not a member of the group
 */
 router.get(
  '/:groupId?',
  [
    userValidator.isUserLoggedIn,
    groupValidator.isGroupExists,
    groupValidator.isUserMember,
  ],
  async (req: Request, res: Response) => {
    const group = await GroupCollection.findOneByGroupId(req.params.groupId as string);
    res.status(200).json(util.constructGroupResponse(group));
  }
);

/**
 * Create a new group.
 *
 * @name POST /api/groups
 *
 * @param {string} name - name of group
 * @param {string} isPrivate - The privacy setting of the group
 * @return {GroupResponse} - The created group
 * @throws {403} - If the user is not logged in
 * @throws {409} - If name is already taken
 * @throws {412} - If privacy setting is not valid
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    groupValidator.isNameNotAlreadyInUse,
    groupValidator.isValidPrivacySetting,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const isPrivate = (req.body.isPrivate == "true") ?? false; //default for empty space is false anonymity setting
    const group = await GroupCollection.addOne(req.body.name, userId, isPrivate);

    res.status(201).json({
      message: 'Your group was created successfully.',
      group: util.constructGroupResponse(group)
    });
  }
);

/**
 * Delete a group
 *
 * @name DELETE /api/groups/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not an admin of
 *                 the group
 * @throws {404} - If the groupId is not found
 */
 router.delete(
  '/:groupId?',
  [
    userValidator.isUserLoggedIn,
    groupValidator.isGroupExists,
    groupValidator.isUserAdmin,
  ],
  async (req: Request, res: Response) => {
    await GroupCollection.deleteOne(req.params.groupId);
    res.status(200).json({
      message: 'Your freet was deleted successfully.'
    });
  }
);

/**
 * Modify a group's privacy setting
 *
 * @name PUT /api/groups/:id?isPrivate=BOOLEAN
 *
 * @return {GroupResponse} - the updated freet
 * @throws {400} - If the privacy setting is not present
 * @throws {403} - If the user is not logged in or not an admin of the group
 * @throws {404} - If the groupId is not found
 * @throws {412} - If privacy setting is not valid
 */
router.put(
  '/:groupId?',
  [
    userValidator.isUserLoggedIn,
    groupValidator.isGroupExists,
    groupValidator.isUserAdmin,
    groupValidator.isValidPrivacySettingQuery,
  ],
  async (req: Request, res: Response) => {
    const privacy = req.query.isPrivate as string;
    if (privacy.trim() !== "") {
      const group = await GroupCollection.updateOnePrivacy(req.params.groupId, (privacy == "true"));
      res.status(200).json({
        message: 'Your group privacy setting was updated successfully.',
        freet: util.constructGroupResponse(group)
      });
    } else {
      res.status(412).json({
        message: 'No update provided for your group privacy setting.',
      })
    }
    
  }
)

/**
 * Modify the group to add a new member
 *
 * @name PUT /api/groups/:groupId/member
 *
 * @param {string} userId - The id of the user to add
 * @return {GroupResponse} - The updated group
 * @throws {404} - If the groupId is not found
 * @throws {404} - if userId does not belong to an account
 * @throws {400} - if userId is not valid
 * @throws {409} - if user given by userId is already a member of the group
 * @throws {403} - if the current user is not an admin of the group
 * @throws {403} - if the current user is not logged in
 */
 router.put(
  '/:groupId/member',
  [
    userValidator.isUserLoggedIn,
    groupValidator.isGroupExists,
    groupValidator.isUserExists,
    groupValidator.isUserAdmin,
    groupValidator.isGivenUserMember,
  ],
  async (req: Request, res: Response) => {
    const group = await GroupCollection.updateOneMember(req.params.groupId, req.body.userId);
    res.status(200).json({
      message: 'Your group\'s members list was updated successfully.',
      group: util.constructGroupResponse(group),
    });
  }
);

/**
 * Modify the group to add a new admin
 *
 * @name PUT /api/groups/:groupId/admin
 *
 * @param {string} userId - The id of the user to add
 * @return {GroupResponse} - The updated group
 * @throws {404} - If the groupId is not found
 * @throws {404} - if userId does not belong to an account
 * @throws {400} - if userId is not valid
 * @throws {403} - if user given by userId is not a member of the group
 * @throws {409} - if user given by userId is already an admin of the group
 * @throws {403} - if the current user is not an admin of the group
 * @throws {403} - if the current user is not logged in
 */
 router.put(
  '/:groupId/admin',
  [
    userValidator.isUserLoggedIn,
    groupValidator.isGroupExists,
    groupValidator.isUserExists,
    groupValidator.isUserAdmin,
    groupValidator.isGivenUserMember,
    groupValidator.isGivenUserAdminAlready,
  ],
  async (req: Request, res: Response) => {
    const group = await GroupCollection.updateOneAdministrator(req.params.groupId, req.body.userId);
    res.status(200).json({
      message: 'Your group\'s administrators list was updated successfully.',
      group: util.constructGroupResponse(group),
    });
  }
);

/**
 * Modify the group to add a new post
 *
 * @name PUT /api/groups/:groupId/post
 *
 * @param {string} freetId - The id of the post to add
 * @return {GroupResponse} - The updated group
 * @throws {404} - If the groupId is not found
 * @throws {404} - if freetId does not belong to an account or is not valid
 * @throws {409} - if post given by freetId is already in the group's posts
 * @throws {403} - if the user is not a member of the group
 * @throws {403} - if the user is not logged in
 */
 router.put(
  '/:groupId/post',
  [
    userValidator.isUserLoggedIn,
    groupValidator.isGroupExists,
    groupValidator.isUserMember,
    groupValidator.isFreetExists,
    groupValidator.isFreetInGroup,
  ],
  async (req: Request, res: Response) => {
    const group = await GroupCollection.updateOnePost(req.params.groupId, req.body.freetId);
    res.status(200).json({
      message: 'Your group\'s posts were updated successfully.',
      group: util.constructGroupResponse(group),
    });
  }
);


export {router as groupRouter};
