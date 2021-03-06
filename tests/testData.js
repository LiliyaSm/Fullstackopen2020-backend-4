const Blog = require("../models/blog");
const User = require("../models/user");

const notesInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
    const users = await User.find({});
    return users.map((u) => u.toJSON());
};

const listWithOneBlog = [
    {
        _id: "6a422aa71b54a676234d17f8",
        title: "New blog",
        author: "New author",
        url: "http://www.new.html",
        likes: 5,
        __v: 0,
    },
];

const missingLikesBlog = [
    {
        _id: "6a421aa71b54a676234d17f8",
        title: "No likes title",
        author: "No likes author",
        url: "http://www.noLikes.html",
        __v: 0,
    },
];

const missingTitleBlog = [
    {
        _id: "6a421aa71b54a676234d17f8",
        author: "No likes author",
        __v: 0,
    },
];

const empty = [];

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        user: "5f4f6bcd0b20705a3cc54dd4",
        likes: 7,
        __v: 0,
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url:
            "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0,
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0,
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url:
            "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0,
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url:
            "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0,
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0,
    },
];

module.exports = {
    listWithOneBlog,
    empty,
    blogs,
    missingLikesBlog,
    missingTitleBlog,
    notesInDb,
    usersInDb,
};
