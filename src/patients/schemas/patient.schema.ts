import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type PatientDocument = HydratedDocument<Patient>;
@Schema({ timestamps: true, versionKey: false })
export class Patient {
 @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true }) user: Types.ObjectId;
 @Prop({ required: true }) firstName: string; @Prop({ required: true }) lastName: string;
 @Prop() phone?: string; @Prop() dateOfBirth?: Date; @Prop() gender?: string; @Prop() address?: string;
}
export const PatientSchema = SchemaFactory.createForClass(Patient);
