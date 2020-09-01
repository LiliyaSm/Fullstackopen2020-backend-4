const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});

// Blog.find({}).then((blogs) => {
//     response.json(blogs);
// });

blogsRouter.post("/", async (request, response) => {
    request.body.likes = request.body.likes ?? 0;

    if (!request.body.title && !request.body.url) {
        response.status(404).end();
    } else {
        const blog = await new Blog(request.body).save();

        response.status(201).json(blog);
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
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
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
