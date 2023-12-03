import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Roles } from "src/shared/roles.enum";
import * as bcrypt from "bcrypt"

@Schema({
    timestamps: true
})
export class User {

    @Prop({
        required: true,
    })
    name: string

    @Prop({
        required: true
    })
    email: string

    @Prop({
        required: true
    })
    password: string

    @Prop({
        required: true
    })
    phone: string

    @Prop({
        type: String,
        enum: Roles,
        default: Roles.Client
    })
    role: Roles
}

const UserSchema = SchemaFactory.createForClass(User);
const SALT_WORK_FACTOR = 10;
UserSchema.pre('save', function (next) {
    var user = this;
    //Only hash if password is modified or new
    if (!user.isModified('password')) return next();

    //generate salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        //hash the password along with salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            //overrides the cleartext password with hashed one
            user.password = hash;
            next()
        });
    });

});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

export { UserSchema }
