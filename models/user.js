const mongoose = require('mongoose');
const {Schema} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    }
});

userSchema.plugin(passportLocalMongoose, {
    errorMessages: {
        UserExistsError: 'このユーザはすでに存在します。',
    }
});//これでユーザスキーマにパスポートが適用される

module.exports = mongoose.model('User', userSchema);