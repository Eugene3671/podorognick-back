// src/middleware/notFoundHandler.js

export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: 'Route not found' });
};
