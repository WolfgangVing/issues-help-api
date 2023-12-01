import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose from "mongoose"

@Schema()
export class User {

    @Prop(
        {type: mongoose.Schema.Types.ObjectId}
    )
    _id: string;
    @Prop()
    name: string
}

export const UserSchema = SchemaFactory.createForClass(User);