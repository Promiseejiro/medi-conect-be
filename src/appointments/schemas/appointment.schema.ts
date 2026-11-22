import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; import { HydratedDocument, Types } from 'mongoose';
export type AppointmentDocument = HydratedDocument<Appointment>;
@Schema({ timestamps:true, versionKey:false }) export class Appointment {

 @Prop({type:Types.ObjectId,ref:'Patient',required:true,index:true}) patient:Types.ObjectId;
 @Prop({type:Types.ObjectId,ref:'Doctor',required:true,index:true}) doctor:Types.ObjectId;
 @Prop({type:Types.ObjectId,ref:'DoctorService',required:true}) service:Types.ObjectId;
 @Prop({required:true}) startsAt:Date; @Prop({required:true}) endsAt:Date;
 @Prop({enum:['PENDING','CONFIRMED','CANCELLED','COMPLETED','REJECTED'],default:'PENDING',index:true}) status:string;
 @Prop() cancellationReason?:string; @Prop({default:'UNPAID',enum:['UNPAID','PENDING','PAID','FAILED','REFUNDED']}) paymentStatus:string;

}
export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
