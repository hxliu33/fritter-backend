import type {HydratedDocument, Types} from 'mongoose';
import type {Pause} from './model';
import PauseModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore pause settings
 * stored in MongoDB, including adding, finding, and updating pause settings.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Pause> is the output of the PauseModel() constructor,
 * and contains all the information in Pause. https://mongoosejs.com/docs/typescript.html
 */
class PauseCollection {
  /**
   * Add a pause to the collection
   *
   * @param {string} user - The id of the user of the pause setting
   * @param {number} minutesActive - The number of minutes the user has been active in their current session
   * @param {number} threshold - The number of minutes the user wants to be active in their current session before receiving a pause notification
   * @return {Promise<HydratedDocument<Pause>>} - The newly created pause setting
   */
  static async addOne(user: Types.ObjectId | string, minutesActive: number, threshold: number): Promise<HydratedDocument<Pause>> {
    const pause = new PauseModel({
      user,
      minutesActive,
      threshold,
    });
    await pause.save(); // Saves pause to MongoDB
    return pause.populate('user');
  }

  /**
   * Find a pause setting by pauseId
   *
   * @param {string} pauseId - The id of the pause setting to find
   * @return {Promise<HydratedDocument<Pause>> | Promise<null> } - The pause setting with the given pauseId, if any
   */
  static async findOne(pauseId: Types.ObjectId | string): Promise<HydratedDocument<Pause>> {
    return PauseModel.findOne({_id: pauseId}).populate('user');
  }

  /**
   * Find a pause setting by userId
   *
   * @param {string} userId - The userId of the pause setting to find
   * @return {Promise<HydratedDocument<Pause>> | Promise<null> } - The pause setting with the given pauseId, if any
   */
   static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<Pause>> {
    const user = await UserCollection.findOneByUserId(userId);
    return PauseModel.findOne({user: user._id}).populate('user');
  }

  /**
   * Update a pause setting with the new minutes active
   *
   * @param {string} pauseId - The id of the pause setting to be updated
   * @param {number} minutesActive - The new minutes active of the user
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated pause setting
   */
  static async updateOne(pauseId: Types.ObjectId | string, minutesActive: number): Promise<HydratedDocument<Pause>> {
    const pause = await PauseModel.findOne({_id: pauseId});
    pause.minutesActive = minutesActive;
    await pause.save();
    return pause.populate('user');
  }

  /**
   * Update a pause setting with the new threshold
   *
   * @param {string} pauseId - The id of the pause setting to be updated
   * @param {number} threshold - The new time threshold the user would like
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated pause setting
   */
   static async updateOneThreshold(pauseId: Types.ObjectId | string, threshold: number): Promise<HydratedDocument<Pause>> {
    const pause = await PauseModel.findOne({_id: pauseId});
    pause.threshold = threshold;
    await pause.save();
    return pause.populate('user');
  }

}

export default PauseCollection;
