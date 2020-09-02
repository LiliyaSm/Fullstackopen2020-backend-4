const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const testData = require("./testData");
const bcrypt = require("bcryptjs");

const api = supertest(app);

const User = require("../models/user");

describe("creation invalid users ", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        const saltRounds = bcrypt.genSaltSync(10);

        const passwordHash = await bcrypt.hashSync("sekret", saltRounds);
        const user = new User({ username: "root", passwordHash });

        await user.save();
    });

    test(" users with invalid password are not created", async () => {
        usersAtStart = await testData.usersInDb();

        const invalidPassword = {
            username: "newUsername",
            name: "NewName",
            password: "11",
        };

        const result = await api
            .post("/api/users")
            .send(invalidPassword)
            .expect(400)
            .expect("Content-Type", /application\/json/);
        expect(result.body.error).toContain(
            "Password must be at least 3 characters long"
        );
        const usersAtEnd = await testData.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });

    test(" users with non-unique username are not created", async () => {
        usersAtStart = await testData.usersInDb();
        const nonuniqueUsername = {
            username: "root",
            name: "root",
            password: "1111",
        };
        const result = await api
            .post("/api/users")
            .send(nonuniqueUsername)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        expect(result.body.error).toContain("`username` to be unique");

        const usersAtEnd = await testData.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });

    test(" users without username are not created", async () => {
        usersAtStart = await testData.usersInDb();
        const nonuniqueUsername = {
            name: "emma",
            password: "1111",
        };
        const result = await api
            .post("/api/users")
            .send(nonuniqueUsername)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        expect(result.body.error).toContain("Path `username` is required");

        const usersAtEnd = await testData.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
