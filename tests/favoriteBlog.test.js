const listHelper = require("../utils/list_helper");
const testData = require("./testData");

describe("blog has most likes", () => {

    test("when list has only one blog, return it", () => {
        const result = listHelper.favoriteBlog(testData.listWithOneBlog);
        expect(result).toEqual({
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            likes: 5,
        });
    });

    test("empty blog list", () => {
        const result = listHelper.favoriteBlog(testData.empty);
        expect(result).toBe("list is empty");
    });

    test("large blog list", () => {
        const result = listHelper.favoriteBlog(testData.blogs);
        expect(result).toEqual({
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12,
        });
    });

});
