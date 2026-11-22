import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
export enum UserRole { PATIENT='PATIENT', DOCTOR='DOCTOR', ADMIN='ADMIN' }
@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true }) email: string;
  @Prop({ required: true, select: false }) passwordHash: string;
  @Prop({ required: true, enum: UserRole, default: UserRole.PATIENT }) role: UserRole;
  @Prop({ default: true }) isActive: boolean;
  @Prop() lastLoginAt?: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
