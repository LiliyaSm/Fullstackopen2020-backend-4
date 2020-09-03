const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const testData = require("./testData");
const api = supertest(app);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");

let token = "";

beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const saltRounds = bcrypt.genSaltSync(10);

    const passwordHash = await bcrypt.hashSync("sekret", saltRounds);
    const user = new User({
        _id: "5f4f6bcd0b20705a3cc54dd4",
        username: "root",
        passwordHash,
    });

    await user.save();

    const userForToken = {
        username: user.username,
        id: user._id,
    };
    token = jwt.sign(userForToken, process.env.SECRET);

    const blogObject = testData.blogs.map((blog) => new Blog(blog));
    // array of promises
    const promiseArray = blogObject.map((blog) => blog.save());
    await Promise.all(promiseArray);
});

describe("4.8 - 4.12 tests", () => {
    test("the correct amount of blog posts in the JSON format is returned", async () => {
        const response = await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toHaveLength(testData.blogs.length);
    });

    test(" verifies that the unique identifier property of the blog posts is named id", async () => {
        const response = await api.get("/api/blogs");
        response.body.map((r) => {
            expect(r.id).toBeDefined();
        });
    });

    test("successfully creates a new blog post", async () => {
        console.log(token);
        const newBlog = testData.listWithOneBlog[0];
        await api
            .post("/api/blogs")
            .set("Authorization", "bearer " + token)
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const response = await api.get("/api/blogs");
        expect(response.body).toHaveLength(testData.blogs.length + 1);
        
        const titles = response.body.map((r) => r.title);
        expect(titles).toContain("Go To Statement Considered Harmful");
    });

    test("verifies if the likes property is missing from the request, it will default to the value 0", async () => {
        const newBlog = testData.missingLikesBlog[0];

        const response = await api
            .post("/api/blogs")
            .set("Authorization", "bearer " + token)
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        expect(response.body.likes).toEqual(0);
    });

    test("if title and url properties are missing responds with the status code 404", async () => {
        const newBlog = testData.missingTitleBlog[0];
        const response = await api
            .post("/api/blogs")
            .set("Authorization", "bearer " + token)
            .send(newBlog)
            .expect(404);
    });
});

describe("update and delete tests", () => {
    test("delete blog", async () => {
        const blogsAtStart = await testData.notesInDb();
        const blogToDelete = blogsAtStart.filter(
            (blog) => blog.user == "5f4f6bcd0b20705a3cc54dd4"
        )[0];

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set("Authorization", "bearer " + token)
            .expect(204);

        // get blogs from db after deletion
        const blogsAtEnd = await testData.notesInDb();
        expect(blogsAtEnd).toHaveLength(testData.blogs.length - 1);

        const titles = blogsAtEnd.map((r) => r.title);
        expect(titles).not.toContain(blogToDelete.title);
    });

    test("update blog likes", async () => {
        const newBlog = {
            likes: 777,
        };

        const blogsAtStart = await testData.notesInDb();
        const blogToUpdate = blogsAtStart[0];

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(newBlog)
            .expect(200);
        const blogsAtEnd = await testData.notesInDb();
        const likesAtEnd = blogsAtEnd[0].likes;

        expect(likesAtEnd).toEqual(newBlog.likes);

        expect(blogsAtEnd).toHaveLength(testData.blogs.length);
    });
});

describe("token tests", () => {
    test("adding a blog fails with proper status code 401 Unauthorized if token is not provided", async () => {
        const newBlog = testData.listWithOneBlog[0];
        await api
            .post("/api/blogs")
            .send(newBlog)
            .expect(401)
            .expect("Content-Type", /application\/json/);

    });
});

afterAll(() => {
    mongoose.connection.close();
});
