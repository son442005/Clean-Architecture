const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const { MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_USER, MAIL_PASS } = process.env;

  if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS) {
    throw new Error("Mail configuration is incomplete. Check MAIL_HOST, MAIL_USER, MAIL_PASS.");
  }

  transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: parseInt(MAIL_PORT, 10) || 587,
    secure: MAIL_SECURE === "true",
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
  });

  return transporter;
};

const verifyMailConnection = async () => {
  try {
    const t = getTransporter();
    await t.verify();
    logger.info("Mail transporter is ready.");
  } catch (error) {
    logger.warn(`Mail transporter verification failed: ${error.message}`);
  }
};

module.exports = { getTransporter, verifyMailConnection };