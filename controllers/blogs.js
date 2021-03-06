const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", {
        username: 1,
        name: 1,
        id: 1,
    });
    response.json(blogs);
});

// before refact
// Blog.find({}).then((blogs) => {
//     response.json(blogs);
// });

blogsRouter.post("/", async (request, response) => {
    //to create blog user request need to contain authorization token
    const decodedToken = jwt.verify(request.token, process.env.SECRET);

    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: "token missing or invalid" });
    }
    const user = await User.findById(decodedToken.id);

    if (!request.body.title && !request.body.url) {
        response.status(404).end();
    } else {
        const blog = new Blog({
            title: request.body.title,
            //if likes field is empty set it to 0
            likes: request.body.likes ?? 0,
            author: request.body.author,
            url: request.body.url,
            user: user._id,
        });
        const savedBlog = await blog.save();
        user.blogs = user.blogs.concat(savedBlog._id);
        await user.save();
        response.status(201).json(savedBlog);
    }

    // exceptions are automatically passed to the error handling middleware "express-async-error"
});

// before refact
// blog.save()
//     .then((result) => {
//         response.status(201).json(result);
//     })
//     .catch((error) => next(error));

blogsRouter.delete("/:id", async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);

    console.log(decodedToken);
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: "token missing or invalid" });
    }
    const userid = decodedToken.id;
    const user = await User.findById(userid);
    const blog = await Blog.findById(request.params.id);
    console.log(userid, blog.user);

    if (blog.user.toString() === userid.toString()) {
        // delete id from user.blogs array
        await user.blogs.pull({ _id: request.params.id });
        await user.save();
        await Blog.findByIdAndRemove(request.params.id);
        response.status(204).end();
    } else {
        return response.status(401).json({ error: "wrong user" });
    }
});

// we need to update only likes
blogsRouter.put("/:id", async (request, response) => {
    const body = request.body;
    const blog = {
        likes: body.likes,
    };

    // event handler will be called with the new modified document instead of the original
    // A.findByIdAndUpdate(id, update, options, callback)

    let updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
        new: true,
    });
    response.json(updatedBlog.toJSON());
});

module.exports = blogsRouter;
