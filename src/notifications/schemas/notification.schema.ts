import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; import { HydratedDocument, Types } from 'mongoose';
export type NotificationDocument = HydratedDocument<Notification>;
@Schema({ timestamps:true, versionKey:false }) export class Notification {

 @Prop({type:Types.ObjectId,ref:'User',required:true,index:true}) user:Types.ObjectId;
 @Prop({required:true}) title:string; @Prop({required:true,maxlength:2000}) message:string;
 @Prop() type?:string; @Prop({default:false}) read:boolean;

}
export const NotificationSchema = SchemaFactory.createForClass(Notification);
