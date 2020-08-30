const listHelper = require("../utils/list_helper");
const testData = require("./testData");


// Describe blocks used for grouping tests into logical collection
describe("total likes", () => {


    test("when list has only one blog, equals the likes of that", () => {
        const result = listHelper.totalLikes(testData.listWithOneBlog);
        expect(result).toBe(5);
    });

    test("many blogs", () => {
        const result = listHelper.totalLikes(testData.blogs);
        expect(result).toBe(36);
    });

    test("empty list", () => {
        const result = listHelper.totalLikes(testData.empty);
        expect(result).toBe(0);
    });

});
