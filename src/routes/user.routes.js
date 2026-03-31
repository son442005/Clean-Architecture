const express = require("express");
const { body } = require("express-validator");
const { getMe, updateMe } = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation.middleware");

const router = express.Router();

router.use(authenticate);

router.get("/me", getMe);

router.patch("/me", [
  body("name").optional().trim()
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters."),
  validate,
], updateMe);

router.get("/admin/dashboard", authorize("admin"), (req, res) => {
  res.json({ success: true, message: "Welcome to the admin dashboard.", data: { admin: req.user.toPublicJSON() } });
});

module.exports = router;