import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose from "mongoose"

@Schema()
export class User {
    @Prop()
    name: string
}

export const UserSchema = SchemaFactory.createForClass(User);