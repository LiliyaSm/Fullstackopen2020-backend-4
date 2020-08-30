const listHelper = require("../utils/list_helper");
const testData = require("./testData");


describe("blog has most likes", () => {
    test("empty blog list", () => {
        const result = listHelper.mostLikes(testData.empty);
        expect(result).toBe("list is empty");
    });

    test("when list has only one blog, return its data", () => {
        const result = listHelper.mostLikes(testData.listWithOneBlog);
        expect(result).toEqual({
            author: "Edsger W. Dijkstra",
            likes: 5,
        });
    });

    test("large blog list", () => {
        const result = listHelper.mostLikes(testData.blogs);
        expect(result).toEqual({
            author: "Edsger W. Dijkstra",
            likes: 17,
        });
    });
});