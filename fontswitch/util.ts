import type {HydratedDocument} from 'mongoose';
import type {FontSwitch, PopulatedFontSwitch} from '../fontswitch/model';

// Update this if you add a property to the FontSwitch type!
type FontSwitchResponse = {
  _id: string;
  user: string;
  fonts: string[];
  currentFont: string;
};

/**
 * Transform a raw FontSwitch object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<FontSwitch>} fontSwitch - A font switch setting
 * @returns {FontSwitchResponse} - The font switch object formatted for the frontend
 */
const constructFontSwitchResponse = (fontSwitch: HydratedDocument<FontSwitch>): FontSwitchResponse => {
  const fontSwitchCopy: PopulatedFontSwitch = {
    ...fontSwitch.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = fontSwitchCopy.user;
  delete fontSwitchCopy.user;
  return {
    ...fontSwitchCopy,
    _id: fontSwitchCopy._id.toString(),
    user: username,
  };
};

export {
    constructFontSwitchResponse
};