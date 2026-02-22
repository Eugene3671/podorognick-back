import bcrypt from 'bcryptjs';
import { User } from '../models/user.js';
import createHttpError from 'http-errors';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const exist = await User.findOne({ email });
    if (exist) return next(createHttpError(400, 'User already exists'));

    const newUser = await User.create({
      name,
      email,
      password,
    });

    const newSession = await createSession(newUser._id);
    setSessionCookies(res, newSession);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered user!',
      data: {
        accessToken: newSession.accessToken,
        user: newUser,
      },
    });
  } catch (err) {
    return next(createHttpError(500, { message: err.message }));
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return next(createHttpError(401, 'Invalid credentials'));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(createHttpError(401, 'Invalid credentials'));

    await Session.deleteOne({ userId: user._id });

    const newSession = await createSession(user._id);
    setSessionCookies(res, newSession);

    res.status(201).json({
      status: 201,
      message: 'Successfully login!',
      data: {
        accessToken: newSession.accessToken,
        user: user,
      },
    });
  } catch (err) {
    return next(createHttpError(500, { message: err.message }));
  }
};

export const logout = async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }
  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const refreshUserSession = async (req, res, next) => {
  const session = await Session.findOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    return next(createHttpError(401, 'Session token expired'));
  }

  await Session.deleteOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({
    message: 'Session refreshed',
  });
};
