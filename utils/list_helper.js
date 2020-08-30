//always returns 1
const dummy = (blogs) => {
    return 1;
};

// returns the total sum of likes in all of the blog posts
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

// finds out which blog has most likes, returnes author, title and likes fields
const favoriteBlog = (blogs) => {
    let bestBlog = {};
    if (blogs?.length) {
        bestBlog = blogs[0];
    } else {
        return "list is empty";
    }
    blogs.forEach((blog) => {
        if (blog.likes > bestBlog.likes) {
            bestBlog = blog;
        }
    });

    return {
        title: bestBlog.title,
        author: bestBlog.author,
        likes: bestBlog.likes,
    };
};

// returns the author who has the largest amount of blogs and the number of his blogs
const mostBlogs = (blogs) => {
    let dict = {};

    if (!blogs?.length) {
        return "list is empty";
    }

    blogs.map((blog) => {
        if (!dict[blog.author]) {
            dict[blog.author] = 1;
        } else {
            dict[blog.author] += 1;
        }
    });
    console.log(dict);

    // find the max number of blogs
    let resAuthor = Object.keys(dict).reduce((a, b) =>
        dict[a] > dict[b] ? a : b
    );

    return {
        author: resAuthor,
        blogs: dict[resAuthor],
    };
};

// returns the author who has the largest amount of likes and total number of his likes

const mostLikes = (blogs) => {
    let dict = {};

    if (!blogs?.length) {
        return "list is empty";
    } else {
        dict.author = blogs[0].author;
        dict.likes = blogs[0].likes;
    }

    blogs.map((blog) => {
        if (!dict[blog.author]) {
            dict[blog.author] = blog.likes;
        } else {
            dict[blog.author] += blog.likes;
        }
    });

    console.log(dict);

    let resAuthor = Object.keys(dict).reduce((a, b) =>
        dict[a] > dict[b] ? a : b
    );

    return {
        author: resAuthor,
        likes: dict[resAuthor],
    };
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
};
