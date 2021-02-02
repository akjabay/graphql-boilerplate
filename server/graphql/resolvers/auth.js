const jsonwebtoken = require("jsonwebtoken");
const db = require("../../models/index");
const bcrypt = require("bcrypt");
const config = require("../../config");
const { encrypt } = require("../../middlewares/encryption");

module.exports = {
    authSignup: async (args, req) => {
        const input = args.input ? args.input : args;
        const name = input.name;
        const username = input.username;
        const phone = input.phone;
        const email = input.email;
        const password = input.password;
        const errors = [];

        // validation code for email or phone
        const code = 12345;
        const params = {
            code: code,
            name: name,
            username: username,
            phone: phone,
            email: email,
            password: password,
        };

        //send code via sms or email

        username.length < 5
            ? errors.push({
                  message: "username must have at least 5 characters",
              })
            : null;

        const exUser = await db["User"].findOne({
            where: { username: username },
        });

        if (exUser && exUser.status_auth == "inactive") {
            params.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            return await exUser.update(params);
        } else if (exUser) {
            errors.push({
                message: "this user is exists!",
            });
        }

        if (errors.length > 0) {
            const error = new Error("Invalid input.");
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const user = new db["User"](params);
        return await user.save();
    },

    authVerify: async (args, req) => {
        const input = args.input ? args.input : args;
        const username = input.username;
        const password = input.password;
        const code = input.code;
        const errors = [];

        const user = await db["User"].findOne({
            where: {
                username: username,
                status_auth: "inactive",
            },
        });
        // code weill be invalid after 5 mins
        const verify = bcrypt.compareSync(password, user.password);
        if (!verify) {
            errors.push({
                message: "you have not permission",
            });
        }
        const now = new Date().getTime() - 5 * 60 * 1000;
        if (!user) {
            errors.push({
                message: "user is not exists",
            });
        } else if (
            +code !== +user.code ||
            now > new Date(user.updated_at).getTime()
        ) {
            errors.push({
                message: "code is incorrect or expired",
            });
        }

        if (errors.length > 0) {
            const error = new Error("Invalid input.");
            error.data = errors;
            error.code = 422;
            throw error;
        }

        // add permissions to user
        await db["Permission"].create({
            codename: "read product",
            persian_codename: "خواندن محصولات",
            UserId: user.id,
        });
        return await user.update({ status_auth: "active" });
    },

    authLogin: async (args, req) => {
        const query = args.query ? args.query : args;
        const params = { status_auth: "active" };
        query.username ? (params.username = query.username) : null;
        query.phone ? (params.phone = encrypt(query.phone)) : null;
        query.email ? (params.email = query.email) : null;
        const password = query.password;
        const errors = [];

        // params.status_auth = 'active'
        let user = await db["User"].findOne({
            where: params,
            include: db["Permission"],
        });
        if (!user) {
            errors.push({
                message: "user not founded!",
            });
        }
        let token;
        const verify = bcrypt.compareSync(password, user.password);
        if (verify) {
            token = jsonwebtoken.sign(
                {
                    id: user.id,
                },
                config.secretKey,
                {
                    expiresIn: 6000000,
                }
            );
            req.session.user = await db["User"].findOne({
                where: params,
                include: db["Permission"],
            });
        } else {
            token = null;
            user = null;
        }

        if (errors.length > 0) {
            const error = new Error("Invalid input.");
            error.data = errors;
            error.code = 422;
            throw error;
        }

        return {
            user: user,
            token: token,
        };
    },

    authCheckUsername: async (args, req) => {
        const creator = req.creator;
        const query = args.query ? args.query : args;

        const user = await db["User"].findOne({
            where: {
                username: query.username,
                status_auth: "active",
            },
        })
        const isexist = !user || user.id === creator
            ? false
            : true;
        
        return isexist;
    },

    authLogout: async (args, req) => {
        const creator = req.creator;
        req.session.destroy(function (err) {
            if (err) {
                throw new Error("session error");
            }
        });
        return creator;
    },

    authFindMe: async (args, req) => {
        const creator = req.creator;
        return await db["User"].findByPk(creator);
    },
};
