const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Permission = sequelize.define("Permission", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    codename: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
    },

    persian_codename: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
    },
});

module.exports = Permission;
