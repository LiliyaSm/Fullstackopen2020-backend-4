const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


// fix deprecation warnings
mongoose.set('useCreateIndex', true)

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        unique: true,
    },
    name: {
        type: String,
    },
    passwordHash: String,
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
        },
    ],
});

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        // the passwordHash should not be revealed
        delete returnedObject.passwordHash;
    },
});

const User = mongoose.model("User", userSchema);

userSchema.plugin(uniqueValidator);
module.exports = User;
