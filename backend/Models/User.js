const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "can't be Blank"]
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be Blank"],
        index: true,
        validate: [isEmail, "invalid Email"]
    },
    password: {
        type: String,
        required: [true, "can't be Blank"]
    },
    picture: {
        type: String,
    },
    newMessages: {
        type: Object,
        default: {}
    },
    status: {
        type: String,
        default: 'online',
    }
}, { minimize: false });

UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash
            next();
        })

    })

})


UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

UserSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('invalid Email or Password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('invalid Email or Password')
    return user
}

const User = mongoose.model('User', UserSchema);
module.exports = User