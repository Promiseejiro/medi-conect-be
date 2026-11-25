import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Availability, AvailabilityDocument } from './schemas/availability.schema';
import { Doctor, DoctorDocument } from '../doctors/schemas/doctor.schema';
@Injectable()
export class AvailabilityService {
  constructor(@InjectModel(Availability.name) private model: Model<AvailabilityDocument>, @InjectModel(Doctor.name) private doctors: Model<DoctorDocument>) {}
  list(doctorId: string) { if (!doctorId || !Types.ObjectId.isValid(doctorId)) return []; return this.model.find({ doctor: new Types.ObjectId(doctorId), active: true }).sort({ dayOfWeek: 1, startTime: 1 }); }
  async create(userId: string, body: any) { const day = Number(body.dayOfWeek); const startTime = String(body.startTime ?? ''); const endTime = String(body.endTime ?? ''); if (!Number.isInteger(day) || day < 0 || day > 6) throw new BadRequestException('dayOfWeek must be a number from 0 (Sunday) to 6 (Saturday)'); if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(endTime)) throw new BadRequestException('Use 24-hour HH:mm times'); if (startTime >= endTime) throw new BadRequestException('End time must be later than start time'); const doctor = await this.doctors.findOne({ user: new Types.ObjectId(userId) }); if (!doctor) throw new NotFoundException('Doctor profile not found for the signed-in account'); return this.model.create({ dayOfWeek: day, startTime, endTime, doctor: doctor._id }); }
  async remove(userId: string, id: string) { const doctor = await this.doctors.findOne({ user: new Types.ObjectId(userId) }); if (!doctor) throw new NotFoundException('Doctor profile not found for the signed-in account'); if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Availability not found'); const item = await this.model.findOneAndUpdate({ _id: id, doctor: doctor._id, active: true }, { $set: { active: false } }, { new: true }); if (!item) throw new NotFoundException('Availability not found'); return item; }
}
