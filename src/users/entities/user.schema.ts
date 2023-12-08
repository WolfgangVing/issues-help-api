import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Role } from "src/shared/roles.enum";
import * as bcrypt from "bcrypt"
import { Model, Types } from "mongoose";

@Schema({
    timestamps: true
})
export class User {

    @Prop({
        required: true,
    })
    name: string

    @Prop({
        required: true,
        index: {
            unique: true,
        },
        validate: {
            validator: async function (email: string): Promise<boolean> {
                const model = await this.constructor as Model<User>;
                const id = await this._id as Types.ObjectId;
                const user = await model.exists({ email }).exec();

                return user === null || this._id.equals(user._id);
            },
            message: "Already used email"
        }
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
        enum: Role,
        default: Role.Client
    })
    role: Role
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
