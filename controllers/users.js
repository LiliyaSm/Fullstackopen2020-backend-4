const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

usersRouter.post("/", async (request, response) => {
    const body = request.body;
    // check before hashing that password at least 3 characters long
    if (!body.password || body.password.length < 3) {
        return response
            .status(400)
            .json({
                error: "Password must be at least 3 characters long",
            })
            .end();
    }

    const saltRounds = bcrypt.genSaltSync(10);
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
    //join corresponding blogs to users
    const users = await User.find({}).populate("blogs", {
        url: 1,
        title: 1,
        author: 1,
        id:1
    });
    response.json(users);
});

module.exports = usersRouter;
