const authController = require("./auth");
const userController = require("./user");

const rootResolver = {
    ...authController,
    ...userController,
};

module.exports = rootResolver;
