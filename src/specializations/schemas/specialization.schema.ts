import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; import { HydratedDocument } from 'mongoose';
export type SpecializationDocument=HydratedDocument<Specialization>;
@Schema({timestamps:true,versionKey:false}) export class Specialization { @Prop({required:true,unique:true,trim:true}) name:string; @Prop() description?:string; @Prop({default:true}) active:boolean; }
export const SpecializationSchema=SchemaFactory.createForClass(Specialization);
