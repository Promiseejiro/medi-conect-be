import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; import { HydratedDocument, Types } from 'mongoose';
export type DoctorServiceDocument = HydratedDocument<DoctorService>;
@Schema({ timestamps:true, versionKey:false }) export class DoctorService {

 @Prop({type:Types.ObjectId,ref:'Doctor',required:true,index:true}) doctor:Types.ObjectId;
 @Prop({required:true,trim:true}) name:string; @Prop({maxlength:2000}) description?:string;
 @Prop({required:true,min:0}) price:number; @Prop({default:'USD',uppercase:true}) currency:string;
 @Prop({default:30,min:10,max:240}) durationMinutes:number;
 @Prop({required:true,enum:['VIDEO','PHONE','IN_PERSON']}) consultationType:string;
 @Prop({default:false}) paymentRequired:boolean; @Prop({default:true}) active:boolean;

}
export const DoctorServiceSchema = SchemaFactory.createForClass(DoctorService);
