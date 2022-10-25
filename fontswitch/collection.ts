import type {HydratedDocument, Types} from 'mongoose';
import type {FontSwitch} from './model';
import FontSwitchModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore font switch settings
 * stored in MongoDB, including adding, finding, deleting, and updating font switch settings.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<FontSwitch> is the output of the FontSwitchModel() constructor,
 * and contains all the information in FontSwitch. https://mongoosejs.com/docs/typescript.html
 */
class FontSwitchCollection {
  /**
   * Add a font switch object to the collection
   *
   * @param {string} userId - The id of the user of the font switch setting
   * @param {string[]} fonts - The list of fonts available to the user
   * @param {string} currentFont - The current font to use
   * @return {Promise<HydratedDocument<FontSwitch>>} - The newly created font switch setting
   */
  static async addOne(userId: Types.ObjectId | string, fonts: string[], currentFont: string): Promise<HydratedDocument<FontSwitch>> {
    const fontSwitch = new FontSwitchModel({
      user: userId,
      fonts,
      currentFont,
    });
    await fontSwitch.save(); // Saves font switch to MongoDB
    return fontSwitch.populate('user');
  }

  /**
   * Find font switch setting by fontSwitchId
   *
   * @param {string} fontSwitchId - The id of the font switch setting to find
   * @return {Promise<HydratedDocument<FontSwitch>> | Promise<null> } - The font switch setting with the given fontSwitchId, if any
   */
  static async findOne(fontSwitchId: Types.ObjectId | string): Promise<HydratedDocument<FontSwitch>> {
    return FontSwitchModel.findOne({_id: fontSwitchId}).populate('user');
  }

  /**
   * Find font switch setting by userId
   *
   * @param {string} userId - The userId of the font switch setting to find
   * @return {Promise<HydratedDocument<FontSwitch>> | Promise<null> } - The font switch setting associated with the user, if any
   */
   static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<FontSwitch>> {
    const user = await UserCollection.findOneByUserId(userId);
    return FontSwitchModel.findOne({user: user._id}).populate('user');
  }

  /**
   * Update a font switch setting with the new current font
   *
   * @param {string} fontSwitchId - The id of the font switch setting to be updated
   * @param {string} currentFont - The new current font of the user
   * @return {Promise<HydratedDocument<FontSwitch>>} - The newly updated pause setting
   */
  static async updateOne(fontSwitchId: Types.ObjectId | string, currentFont: string): Promise<HydratedDocument<FontSwitch>> {
    const fontSwitch = await FontSwitchModel.findOne({_id: fontSwitchId});
    fontSwitch.currentFont = currentFont.trim();
    await fontSwitch.save();
    return fontSwitch.populate('user');
  }

  /**
   * Update a list of potential fonts with a new font
   *
   * @param {string} fontSwitchId - The id of the font switch setting to be updated
   * @param {string} newFont - The new font the user would like to add
   * @return {Promise<HydratedDocument<FontSwitch>>} - The newly updated font switch setting
   */
   static async updateOneList(fontSwitchId: Types.ObjectId | string, newFont: string): Promise<HydratedDocument<FontSwitch>> {
    const fontSwitch = await FontSwitchModel.findOne({_id: fontSwitchId});
    const fontList = fontSwitch.fonts;
    fontList.push(newFont.trim());
    fontSwitch.fonts = fontList;
    await fontSwitch.save();
    return fontSwitch.populate('user');
  }

  /**
   * Update the list of potential fonts to remove the given font.
   *
   * @param {string} fontSwitchId - The fontSwitchId of the setting to update
   * @param {string} fontToRemove - The font the user would like to remove
   * @return {Promise<HydratedDocument<FontSwitch>>} - The newly updated font switch setting
   */
    static async updateOneRemove(fontSwitchId: Types.ObjectId | string, fontToRemove: string): Promise<HydratedDocument<FontSwitch>> {
        const fontSwitch = await FontSwitchModel.findOne({_id: fontSwitchId});
        const fontList = fontSwitch.fonts;
        var idxToRemove = fontList.indexOf(fontToRemove.trim());
        while (idxToRemove != -1) {
            fontList.splice(idxToRemove, 1);
            idxToRemove = fontList.indexOf(fontToRemove.trim());
        }
        fontSwitch.fonts = fontList;
        await fontSwitch.save();
        return fontSwitch.populate('user');
      }

}

export default FontSwitchCollection;
