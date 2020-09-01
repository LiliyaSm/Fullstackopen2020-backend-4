const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");


usersRouter.post("/", async (request, response) => {
    const body = request.body;

    const saltRounds = bcrypt.genSaltSync(10);;
    const passwordHash = await bcrypt.hashSync(body.password, saltRounds);

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    });

    const savedUser = await user.save();

    response.json(savedUser);
});


usersRouter.get("/", async (request, response) => {
    const users = await User.find({});
    response.json(users);
});

module.exports = usersRouter;