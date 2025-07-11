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
        IncorrectPasswordError: 'パスワードが間違っています。',
        MissingPasswordError: 'パスワードが入力されていません。',
        MissingUsernameError: 'ユーザ名が入力されていません。',
        IncorrectUsernameError: 'ユーザ名が間違っています。',
        UserNotFoundError: 'ユーザが見つかりません。',
        AttemptTooSoonError: 'ログイン試行が早すぎます。しばらく待ってから再試行してください。',
        TooManyAttemptsError: 'ログイン試行が多すぎます。しばらく待ってから再試行してください。',
        NoSaltValueStoredError: 'パスワードのハッシュ化に失敗しました。パスワードのソルト値が保存されていません。',
        InvalidSalt: '無効なソルト値です。パスワードのハッシュ化に失敗しました。',
        InvalidHash: '無効なハッシュ値です。パスワードのハッシュ化に失敗しました。',
    }
});//これでユーザスキーマにパスポートが適用される

module.exports = mongoose.model('User', userSchema);