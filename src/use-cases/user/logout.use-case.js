const { clearAuthCookies } = require("../../utils/jwt");

const logout = (res) => {
  clearAuthCookies(res);
};

module.exports = logout;