import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Doctor, DoctorDocument } from './schemas/doctor.schema';
@Injectable()
export class DoctorsService {
  constructor(@InjectModel(Doctor.name) private readonly model: Model<DoctorDocument>) {}
  list(query: any = {}) { const filter: any = { active: true, published: true }; if (query.specialization) filter.specializations = query.specialization; return this.model.find(filter).populate('specializations').populate('user', 'email').sort({ createdAt: -1 }); }
  async get(id: string) { if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Doctor not found'); const doctor = await this.model.findOne({ _id: id, active: true, published: true }).populate('specializations').populate('user', 'email'); if (!doctor) throw new NotFoundException('Doctor not found'); return doctor; }
  async me(userId: string) { if (!Types.ObjectId.isValid(userId)) throw new BadRequestException('Authenticated user ID is invalid'); const doctor = await this.model.findOne({ user: new Types.ObjectId(userId) }).populate('specializations').populate('user', 'email'); if (!doctor) throw new NotFoundException('Doctor profile is not linked to this account. Sign out and sign in again, or contact support to repair the profile.'); return doctor; }
  async update(userId: string, dto: any) { const update = { ...dto }; if (update.specializationIds) { update.specializations = update.specializationIds; delete update.specializationIds; } for (const key of ['_id','user','role','password','passwordHash','active']) delete update[key]; const doctor = await this.model.findOneAndUpdate({ user: new Types.ObjectId(userId) }, { $set: update }, { new: true, runValidators: true }).populate('specializations').populate('user', 'email'); if (!doctor) throw new NotFoundException('Doctor profile not found'); return doctor; }
}
