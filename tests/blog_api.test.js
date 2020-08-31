const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const testData = require("./testData");

const api = supertest(app);

const Blog = require("../models/blog");

beforeEach(async () => {
    await Blog.deleteMany({});
    console.log("cleared");

    const blogObject = testData.blogs.map((blog) => new Blog(blog));
    const promiseArray = blogObject.map((blog) => blog.save());
    await Promise.all(promiseArray);
    console.log("saved");

    console.log("done");
});
describe("4.8 - 4.12 tests", () => {
    test("the correct amount of blog posts in the JSON format is returned", async () => {
        const response = await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/);
        // console.log(response.body);

        expect(response.body).toHaveLength(testData.blogs.length);
    });

    test(" verifies that the unique identifier property of the blog posts is named id", async () => {
        const response = await api.get("/api/blogs");
        response.body.map((r) => {
            // console.log(r);

            expect(r.id).toBeDefined();
        });
    });

    test("successfully creates a new blog post", async () => {
        const newBlog = testData.listWithOneBlog[0];

        await api
            .post("/api/blogs")
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const response = await api.get("/api/blogs");

        const titles = response.body.map((r) => r.title);

        expect(response.body).toHaveLength(testData.blogs.length + 1);
        expect(titles).toContain("Go To Statement Considered Harmful");
    });

    test("verifies that if the likes property is missing from the request, it will default to the value 0", async () => {
        const newBlog = testData.missingLikesBlog[0];

        const response = await api
            .post("/api/blogs")
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        expect(response.body.likes).toEqual(0);
        // const response = await api.get("/api/blogs");
    });

    test("if title and url properties are missing responds with the status code 400", async () => {
        const newBlog = testData.missingTitleBlog[0];
        const response = await api.post("/api/blogs").send(newBlog).expect(404);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
