import bcrypt from 'bcryptjs';
import { User } from '../models/user.js';
import createHttpError from 'http-errors';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

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

    res.status(200).json({
      status: 200,
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

export const requestResetEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError('email is not correct');
  }

  // Користувач є — генеруємо короткоживучий JWT і відправляємо лист
  const resetToken = jwt.sign(
    { sub: user._id, email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );

  // 1. Формуємо шлях до шаблона
  const templatePath = path.resolve('src/templates/reset-password-email.html');
  // 2. Читаємо шаблон
  const templateSource = await fs.readFile(templatePath, 'utf-8');
  // 3. Готуємо шаблон до заповнення
  const template = handlebars.compile(templateSource);
  // 4. Формуємо із шаблона HTML документ з динамічними даними
  const html = template({
    name: user.username,
    link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`,
    date: new Date().toString(),
  });

  try {
    await sendEmail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    console.log(error);

    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }

  // Та сама "нейтральна" відповідь
  res.status(200).json({
    message: 'If this email exists, a reset link has been sent',
  });
};

export const resetPassword = async (req, res) => {
  const { password, token } = req.body;
  // 1. Перевіряємо/декодуємо токен
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // Повертаємо помилку якщо проблема при декодуванні
    throw createHttpError(401, 'Invalid or expired token');
  }
  // 2. Шукаємо користувача
  const user = await User.findOne({ _id: payload.sub, email: payload.email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  // 3. Якщо користувач існує
  // створюємо новий пароль і оновлюємо користувача
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.updateOne({ _id: user._id }, { password: hashedPassword });
  // 4. Інвалідовуємо всі можливі попередні сесії користувача
  await Session.deleteMany({ userId: user._id });
  // 5. Повертаємо успішну відповідь
  res.status(200).json({
    message: 'Password reset successfully',
  });
};
