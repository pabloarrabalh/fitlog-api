const asyncHandler = require('../utils/asyncHandler');
const sessionService = require('../services/sessionService');
const {
  startSessionSchema,
  addSetSchema,
  completeSessionSchema,
  updateSessionSchema
} = require('../validators/sessionSchemas');

const createSession = asyncHandler(async (req, res) => {
  // Validar y sanitizar datos con Zod
  const cleanData = startSessionSchema.parse(req.body);

  const session = await sessionService.createSession(cleanData, req.user._id);

  res.status(201).json({
    success: true,
    data: session
  });
});

const listSessions = asyncHandler(async (req, res) => {
  const sessions = await sessionService.listSessions(req.user._id);

  res.status(200).json({
    success: true,
    data: sessions
  });
});

const getSessionById = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await sessionService.getSessionById(sessionId, req.user._id);

  res.status(200).json({
    success: true,
    data: session
  });
});

const updateSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  // Validar y sanitizar datos con Zod
  const cleanData = updateSessionSchema.parse(req.body);

  const session = await sessionService.updateSession(sessionId, cleanData, req.user._id);

  res.status(200).json({
    success: true,
    data: session
  });
});

const deleteSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await sessionService.deleteSession(sessionId, req.user._id);

  res.status(200).json({
    success: true,
    data: session
  });
});

const addSetToEntry = asyncHandler(async (req, res) => {
  const { sessionId, entryId } = req.params;

  // Validar y sanitizar datos con Zod
  const cleanData = addSetSchema.parse(req.body);

  const session = await sessionService.addSetToEntry(sessionId, entryId, cleanData, req.user._id);

  res.status(200).json({
    success: true,
    data: session
  });
});

const completeSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  // Validar y sanitizar datos con Zod
  const cleanData = completeSessionSchema.parse(req.body);

  const session = await sessionService.completeSession(sessionId, cleanData, req.user._id);

  res.status(200).json({
    success: true,
    data: session
  });
});

module.exports = {
  createSession,
  listSessions,
  getSessionById,
  updateSession,
  deleteSession,
  addSetToEntry,
  completeSession
};
