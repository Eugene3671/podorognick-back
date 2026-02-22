import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader && authHeader.split(' ')[1];

  const accessToken = req.cookies.accessToken || tokenFromHeader;

  if (!accessToken) {
    return next(createHttpError(401, 'Missing access token'));
  }

  const session = await Session.findOne({
    accessToken: accessToken,
  });

  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await User.findById(session.userId);
  if (!user) {
    next(createHttpError(401));
    return;
  }

  req.user = user;
  next();
};
