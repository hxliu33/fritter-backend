import type {HydratedDocument} from 'mongoose';
import type {Pause, PopulatedPause} from '../pause/model';

// Update this if you add a property to the Pause type!
type PauseResponse = {
  _id: string;
  user: string;
  minutesActive: number;
  threshold: number;
};

/**
 * Transform a raw Pause object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Pause>} pause - A pause setting
 * @returns {PauseResponse} - The pause object formatted for the frontend
 */
const constructPauseResponse = (pause: HydratedDocument<Pause>): PauseResponse => {
  const pauseCopy: PopulatedPause = {
    ...pause.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = pauseCopy.user;
  delete pauseCopy.user;
  return {
    ...pauseCopy,
    _id: pauseCopy._id.toString(),
    user: username,
  };
};

export {
  constructPauseResponse
};
