const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

const sequelize = require("../util/database");
const Permission = require("./Permission");
const { encrypt, decrypt } = require("../middlewares/encryption");

const User = sequelize.define("User", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    name: {
        type: Sequelize.STRING,
        notEmpty: true,
    },

    bio: {
        type: Sequelize.STRING,
        notEmpty: true,
    },

    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },

    phone: {
        type: Sequelize.STRING,
        get() {
            const value = this.getDataValue("phone");
            if (value) {
                return decrypt(value);
            } else {
                return null;
            }
        },
        set(value) {
            if (value) {
                this.setDataValue("phone", encrypt(value));
            }
        },
    },

    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true,
        },
    },

    followers_list: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
    },

    following_list: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
    },

    request_to_join: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
    },

    address: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
    },

    user_products: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
    },

    likes: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
    },

    cart: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
    },

    wallet: {
        type: Sequelize.STRING,
        get() {
            const value = this.getDataValue("wallet");
            if (value) {
                return decrypt(value);
            } else {
                return null;
            }
        },
        set(value) {
            if (value) {
                this.setDataValue("wallet", encrypt(value));
            }
        },
    },

    is_superuser: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },

    is_active: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },

    password: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
    },

    last_login: {
        type: Sequelize.DATE,
    },

    sweet_date: {
        type: Sequelize.DATE,
    },

    avatar_url: {
        type: Sequelize.STRING,
    },

    code: {
        type: Sequelize.STRING,
    },

    status_auth: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "inactive",
    },
});

User.hasMany(Permission);
Permission.belongsTo(User);

// cart process
User.prototype.addToCart = function (product) {
    const cartProductIndex = this.cart.findIndex((cp) => {
        return cp.product.pid === product.pid;
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            product: product,
            quantity: newQuantity,
        });
    }

    // refresh first
    this.update({ cart: [] });

    this.cart = updatedCartItems;
    return this.save();
};

User.prototype.minusFromCart = function (product) {
    const cartProductIndex = this.cart.findIndex((cp) => {
        return cp.product.pid.toString() === product.pid.toString();
    });
    let updatedCartItems = [...this.cart];

    if (cartProductIndex >= 0) {
        let newQuantity = this.cart[cartProductIndex].quantity - 1;
        newQuantity > 0
            ? (updatedCartItems[cartProductIndex].quantity = newQuantity)
            : (updatedCartItems = updatedCartItems.filter((item) => {
                  return item.product.pid.toString() !== product.pid.toString();
              }));
    }
    // refresh first
    this.update({ cart: [] });

    this.cart = updatedCartItems;
    return this.save();
};

User.prototype.removeFromCart = function (product) {
    const updatedCartItems = this.cart.filter((item) => {
        return item.product.pid.toString() !== product.pid.toString();
    });

    // refresh first
    this.update({ cart: [] });

    this.cart = updatedCartItems;
    return this.save();
};

User.prototype.clearCart = function () {
    this.cart = [];
    return this.save();
};


User.beforeCreate(async function (user) {
    const salt = await bcrypt.genSalt(10); //whatever number you want
    user.password = await bcrypt.hash(user.password, salt);
});

module.exports = User;
