import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
@Schema({ timestamps: true, versionKey: false })
export class BaseRecord {
  @Prop({ default: true }) active: boolean;
}
export type BaseRecordDocument = HydratedDocument<BaseRecord>;
export const BaseRecordSchema = SchemaFactory.createForClass(BaseRecord);
