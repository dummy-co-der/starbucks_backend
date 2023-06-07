const express = require("express");
const { signin, signout } = require("./control");
const router = express.Router();
router.route("/login").post(signin);
router.route("/logout").post(signout);

module.exports = router;
