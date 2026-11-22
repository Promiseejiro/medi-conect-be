import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; import { HydratedDocument, Types } from 'mongoose';
export type BlockedDateDocument = HydratedDocument<BlockedDate>;
@Schema({ timestamps:true, versionKey:false }) export class BlockedDate {

 @Prop({type:Types.ObjectId,ref:'Doctor',required:true,index:true}) doctor:Types.ObjectId;
 @Prop({required:true}) date:Date; @Prop() reason?:string; @Prop({default:true}) active:boolean;

}
export const BlockedDateSchema = SchemaFactory.createForClass(BlockedDate);
