import type {Request, Response, NextFunction} from 'express';
import FontSwitchCollection from './collection';

/**
 * Checks if a font switch setting with the current user exists
 */
 const isFontSwitchExists = async (req: Request, res: Response, next: NextFunction) => {
  
  const fontSwitch = await FontSwitchCollection.findOneByUserId(req.session.userId as string);

  if (fontSwitch) {
    next();
  } else {
    res.status(404).json({error: 'No font switch setting exists for the user.'});
  }
};

/**
 * Checks if the list of fonts in req.body is not a stream of empty
 * spaces and comma-delineated
 */
const isValidFontList = async (req: Request, res: Response, next: NextFunction) => {
  const {fonts} = req.body as {fonts: string};
  if (!fonts.trim()) {
    res.status(400).json({
      error: 'List of fonts must not be empty.'
    });
    return;
  }
  
  // check each element in list is not empty
  const fontList = fonts.split(',').filter((font) => (font.trim() == ""));
  if (fontList.length > 0) {
    res.status(400).json({
      error: 'List of fonts must be non-empty and separated by commas.'
    });
    return;
  }

  next();
};

/**
 * Checks if the font in req.body is not a stream of empty spaces
 */
 const isFontNotEmpty = async (req: Request, res: Response, next: NextFunction) => {
    const {font} = req.body as {font: string};
    if (!font.trim()) {
      res.status(404).json({
        error: 'Font to remove must not be empty.'
      });
      return;
    }

    next();
  };

/**
 * Checks if the font in req.body is present in the list of the user's fonts
 */
 const isFontInList = async (req: Request, res: Response, next: NextFunction) => { // check font is present in list of user's fonts
    const {font} = req.body as {font: string};
    const fontSwitch = await FontSwitchCollection.findOneByUserId(req.session.userId as string);
    if (fontSwitch.fonts.indexOf(font.trim()) < 0) {
      res.status(404).json({
        error: 'Font must be present in list of user fonts.'
      });
      return;
    }
  
    next();
  };

/**
 * Checks if the font in req.body is not present in the list of the user's fonts
 */
 const isFontNotInList = async (req: Request, res: Response, next: NextFunction) => { // check font is present in list of user's fonts
    if (!isFontInList(req, res, next)) {
        res.status(409).json({
        error: 'Font is already present in list of user fonts.'
        });
        return;
    }
  
    next();
  };

/**
 * Checks if the font in req.body is different from the current one
 */
 const isCurrentFontDifferent = async (req: Request, res: Response, next: NextFunction) => {
    const {font} = req.body as {font: string};    
    const currentFont = (await FontSwitchCollection.findOneByUserId(req.session.userId as string)).currentFont;
    if (currentFont.trim() === font.trim()) {
      res.status(409).json({
        error: 'The font in question is already the current font.'
      });
      return;
    }
  
    next();
  };

export {
  isFontSwitchExists,
  isValidFontList,
  isFontNotEmpty,
  isFontInList,
  isFontNotInList,
  isCurrentFontDifferent,
};
