import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; import { HydratedDocument, Types } from 'mongoose';
export type PaymentDocument = HydratedDocument<Payment>;
@Schema({ timestamps:true, versionKey:false }) export class Payment {

 @Prop({type:Types.ObjectId,ref:'Appointment',required:true,index:true}) appointment:Types.ObjectId;
 @Prop({required:true,min:0}) amount:number; @Prop({required:true,uppercase:true}) currency:string;
 @Prop({default:'PENDING',enum:['PENDING','SUCCEEDED','FAILED','REFUNDED']}) status:string;
 @Prop({unique:true,sparse:true}) stripeSessionId?:string; @Prop() stripePaymentIntentId?:string;

}
export const PaymentSchema = SchemaFactory.createForClass(Payment);
