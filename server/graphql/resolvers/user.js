const db = require("../../models/index");
const bcrypt = require("bcrypt");

module.exports = {
    userCreate: async (args, req) => {
        const input = args.input ? args.input : args;
        const name = input.name;
        const email = input.email;
        const phone = input.phone;
        const password = input.password;
        const username = input.username;

        return await db["User"].create({
            name: name,
            username: username,
            phone: phone,
            email: email,
            password: password,
        });
    },

    userUpdate: async (args, req) => {
        const creator = req.creator;
        const input = args.input ? args.input : args;

        const user = await db["User"].findByPk(creator);

        const salt = await bcrypt.genSalt(10); //whatever number you want
        input.password = await bcrypt.hash(input.password, salt);

        return await user.update(input);
    },

    userFind: async (args, req) => {
        const query = args.query ? args.query : args;
        const id = query.id;
        return await db["User"].findByPk(id);
    },

    userFindByUsername: async (args, req) => {
        const query = args.query ? args.query : args;
        const username = query.username;
        return await db["User"].findOne({
            where: {
                username: username,
            },
            attributes: ["id", "avatar_url", "username"],
        });
    },

    // cart
    userAddToCart: async (args, req) => {
        const creator = req.creator;
        const input = args.input ? args.input : args;

        const user = await db["User"].findByPk(creator);
        const params = input.id ? { id: input.id } : { pid: input.pid };
        const product = await db["Product"].findOne({
            where: params,
            include: [
                db["Category"],
                { model: db["User"], attributes: ["avatar_url", "username"] },
            ],
        });

        return await user.addToCart(product);
    },

    userMinusFromCart: async (args, req) => {
        const creator = req.creator;
        const input = args.input ? args.input : args;

        const user = await db["User"].findByPk(creator);
        const params = input.id ? { id: input.id } : { pid: input.pid };
        const product = await db["Product"].findOne({
            where: params,
            include: [
                db["Category"],
                { model: db["User"], attributes: ["avatar_url", "username"] },
            ],
        });

        return await user.minusFromCart(product);
    },

    userAddCartToCart: async (args, req) => {
        const creator = req.creator;
        const input = args.input ? args.input : args;

        const user = await db["User"].findByPk(creator);
        await user.clearCart();

        for (item of input) {
            const params = item.product.id
                ? { id: item.product.id }
                : { pid: item.product.pid };
            const product = await db["Product"].findOne({
                where: params,
                include: [
                    db["Category"],
                    {
                        model: db["User"],
                        attributes: ["avatar_url", "username"],
                    },
                ],
            });
            for (i = 0; i < item.quantity; i++) {
                await user.addToCart(product);
            }
        }

        return await db["User"].findByPk(creator);
    },

    userRemoveFromCart: async (args, req) => {
        const creator = req.creator;
        const input = args.input ? args.input : args;

        const user = await db["User"].findByPk(creator);
        const params = input.id ? { id: input.id } : { pid: input.pid };
        const product = await db["Product"].findOne({
            where: params,
        });

        return await user.removeFromCart(product);
    },

    userClearCart: async (args, req) => {
        const creator = req.creator;

        const user = await db["User"].findByPk(creator);
        return await user.clearCart();
    },
};
