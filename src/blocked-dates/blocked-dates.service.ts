import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BlockedDate, BlockedDateDocument } from './schemas/blocked-date.schema';
import { Doctor, DoctorDocument } from '../doctors/schemas/doctor.schema';
@Injectable()
export class BlockedDatesService {
  constructor(@InjectModel(BlockedDate.name) private model: Model<BlockedDateDocument>, @InjectModel(Doctor.name) private doctors: Model<DoctorDocument>) {}
  list(doctorId: string) { if (!doctorId || !Types.ObjectId.isValid(doctorId)) return []; return this.model.find({ doctor: new Types.ObjectId(doctorId), active: true }).sort({ date: 1 }); }
  async create(userId: string, body: any) { const date = new Date(body.date); if (!body.date || Number.isNaN(date.getTime())) throw new BadRequestException('A valid blocked date is required'); const doctor = await this.doctors.findOne({ user: new Types.ObjectId(userId) }); if (!doctor) throw new NotFoundException('Doctor profile not found for the signed-in account'); date.setUTCHours(0,0,0,0); return this.model.create({ doctor: doctor._id, date, reason: body.reason }); }
  async remove(userId: string, id: string) { const doctor = await this.doctors.findOne({ user: new Types.ObjectId(userId) }); if (!doctor) throw new NotFoundException('Doctor profile not found for the signed-in account'); if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Blocked date not found'); const item = await this.model.findOneAndUpdate({ _id: id, doctor: doctor._id, active: true }, { $set: { active: false } }, { new: true }); if (!item) throw new NotFoundException('Blocked date not found'); return item; }
}
