import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FontSwitchCollection from './collection';
import * as fontSwitchValidator from '../fontswitch/middleware';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get the current font setting
 *
 * @name GET /api/font
 *
 * @return {string} - The name of the current font
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the user does not have an existing font switch setting
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
    fontSwitchValidator.isFontSwitchExists,
  ],
  async (req: Request, res: Response) => {
    const fontSwitch = await FontSwitchCollection.findOneByUserId(req.session.userId as string);
    res.status(200).json({
        message: 'The current font was fetched successfully',
        currentFont: fontSwitch.currentFont,
    });
  }
);

/**
 * Get the list of potential fonts for the user
 *
 * @name GET /api/font/list
 *
 * @return {string[]} - The list of potential fonts available to the user
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the user does not have an existing font switch setting
 */
 router.get(
    '/list',
    [
      userValidator.isUserLoggedIn,
      fontSwitchValidator.isFontSwitchExists,
    ],
    async (req: Request, res: Response) => {
      const fontSwitch = await FontSwitchCollection.findOneByUserId(req.session.userId as string);
      res.status(200).json({
          message: 'The current font was fetched successfully',
          fonts: fontSwitch.fonts,
      });
    }
  );

/**
 * Create a new font switch setting, with the first font in the list set as the current font
 *
 * @name POST /api/font/list
 *
 * @param {string} fonts - The comma-delineated list of fonts available to the user
 * @return {FontSwitchResponse} - The created font switch setting
 * @throws {403} - If the user is not logged in
 * @throws {400} - If font list has empty fonts
 */
router.post(
  '/list',
  [
    userValidator.isUserLoggedIn,
    fontSwitchValidator.isValidFontList,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const fontString = (req.body.fonts as string);
    const fontList = fontString.split(',').map((font) => font.trim());
    const fontSwitch = await FontSwitchCollection.addOne(userId, fontList, fontList[0]);

    res.status(201).json({
      message: 'Your font switch setting was created successfully.',
      fontSwitch: util.constructFontSwitchResponse(fontSwitch)
    });
  }
);

/**
 * Modify the list of available fonts to remove one
 *
 * @name PUT /api/font/remove
 *
 * @param {string} font - The name of the font to delete
 * @return {FontSwitchResponse} - The updated font switch setting
 * @throws {403} - If the user is not logged in
 * @throws {404} - If font is empty or is not found in list of available fonts
 * @throws {409} - If font to remove is the current font
 */
router.put(
  '/remove',
  [
    userValidator.isUserLoggedIn,
    fontSwitchValidator.isFontNotEmpty,
    fontSwitchValidator.isFontInList,
    fontSwitchValidator.isCurrentFontDifferent,
  ],
  async (req: Request, res: Response) => {
    const fontSwitchId = (await FontSwitchCollection.findOneByUserId(req.session.userId as string))._id;
    const fontSwitch = await FontSwitchCollection.updateOneRemove(fontSwitchId, req.body.font as string);
    res.status(200).json({
      message: 'Your font switch setting was updated successfully.',
      fontSwitch: util.constructFontSwitchResponse(fontSwitch),
    });
  }
);

/**
 * Modify the current used font to replace with a new preexisting one
 *
 * @name PUT /api/font/current
 *
 * @param {string} font - The name of the font to make current
 * @return {FontSwitchResponse} - The updated font switch setting
 * @throws {403} - If the user is not logged in
 * @throws {404} - If font is empty or not in the list of available fonts
 * @throws {409} - If the current font is already the new font
 */
 router.put(
    '/current',
    [
      userValidator.isUserLoggedIn,
      fontSwitchValidator.isFontNotEmpty,
      fontSwitchValidator.isFontInList,
      fontSwitchValidator.isCurrentFontDifferent,
    ],
    async (req: Request, res: Response) => {
      const fontSwitchId = (await FontSwitchCollection.findOneByUserId(req.session.userId as string))._id;
      const fontSwitch = await FontSwitchCollection.updateOne(fontSwitchId, req.body.font as string);
      res.status(200).json({
        message: 'Your font switch setting was updated successfully.',
        fontSwitch: util.constructFontSwitchResponse(fontSwitch),
      });
    }
  );

/**
 * Modify the list of available fonts to add a new one
 *
 * @name PUT /api/font/new
 *
 * @param {string} font - The name of the font to add
 * @return {FontSwitchResponse} - The updated font switch setting
 * @throws {403} - If the user is not logged in
 * @throws {404} - If font is empty
 * @throws {409} - If the current font is already in the list of available fonts
 */
 router.put(
    '/new',
    [
      userValidator.isUserLoggedIn,
      fontSwitchValidator.isFontNotEmpty,
      fontSwitchValidator.isFontNotInList,
    ],
    async (req: Request, res: Response) => {
      const fontSwitchId = (await FontSwitchCollection.findOneByUserId(req.session.userId as string))._id;
      const fontSwitch = await FontSwitchCollection.updateOneList(fontSwitchId, req.body.font as string);
      res.status(200).json({
        message: 'Your font switch setting was updated successfully.',
        fontSwitch: util.constructFontSwitchResponse(fontSwitch),
      });
    }
  );

export {router as fontSwitchRouter};
