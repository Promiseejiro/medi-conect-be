import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; import { HydratedDocument, Types } from 'mongoose';
export type AvailabilityDocument = HydratedDocument<Availability>;
@Schema({ timestamps:true, versionKey:false }) export class Availability {

 @Prop({type:Types.ObjectId,ref:'Doctor',required:true,index:true}) doctor:Types.ObjectId;
 @Prop({required:true,min:0,max:6}) dayOfWeek:number; @Prop({required:true}) startTime:string; @Prop({required:true}) endTime:string; @Prop({default:true}) active:boolean;

}
export const AvailabilitySchema = SchemaFactory.createForClass(Availability);
