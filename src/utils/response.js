const sendSuccess = (res, { statusCode = 200, message = "Success", data = null, meta = null } = {}) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  if (meta !== null) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

const sendCreated = (res, { message = "Created successfully", data = null } = {}) => {
  return sendSuccess(res, { statusCode: 201, message, data });
};

const sendError = (res, { statusCode = 500, message = "Internal server error", code = null, errors = null } = {}) => {
  const payload = { success: false, message };
  if (code) payload.code = code;
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

module.exports = { sendSuccess, sendCreated, sendError };