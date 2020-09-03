const listHelper = require("../utils/list_helper");
const testData = require("./testData");

describe("blog has most likes", () => {
    test("empty blog list", () => {
        const result = listHelper.mostBlogs(testData.empty);
        expect(result).toBe("list is empty");
    });

    test("when list has only one blog, return its data", () => {
        const result = listHelper.mostBlogs(testData.listWithOneBlog);
        expect(result).toEqual({
            author: "New author",
            blogs: 1,
        });
    });

    test("large blog list", () => {
        const result = listHelper.mostBlogs(testData.blogs);
        expect(result).toEqual({
            author: "Robert C. Martin",
            blogs: 3,
        });
    });
});
