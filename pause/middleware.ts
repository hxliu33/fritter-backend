import type {Request, Response, NextFunction} from 'express';

/**
 * Checks if the content of the pause setting in req.body is valid, i.e not a stream of empty
 * spaces and numbers
 */
const isValidPauseContent = async (req: Request, res: Response, next: NextFunction) => {
  const {minutesActive, threshold} = req.body as {minutesActive: string, threshold: string};
  if (!minutesActive.trim() || !threshold.trim()) {
    res.status(400).json({
      error: 'Pause minutesActive and threshold must be at least one number long.'
    });
    return;
  }
  
  if (isNaN(+minutesActive) || isNaN(+threshold)) {
    res.status(400).json({
      error: 'Pause minutesActive and threshold must be numbers.'
    });
    return;
  }

  next();
};

/**
 * Checks if the time passed into req.body is valid, i.e not a stream of empty
 * spaces and numbers
 */
 const isValidTime = async (req: Request, res: Response, next: NextFunction) => {
    const {minutes} = req.body as {minutes: string};
    if (!minutes.trim()) {
      res.status(400).json({
        error: 'Time must be at least one number long.'
      });
      return;
    }
    
    if (isNaN(+minutes)) {
      res.status(400).json({
        error: 'Time must be a number.'
      });
      return;
    }
  
    next();
};

export {
  isValidPauseContent,
  isValidTime,
};
