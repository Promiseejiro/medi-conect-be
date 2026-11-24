import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Doctor, DoctorDocument } from './schemas/doctor.schema';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor.name)
    private readonly model: Model<DoctorDocument>,
  ) {}

  list(query: any = {}) {
    return this.model
      .find({
        active: true,
        published: true,
        ...(query.specialization
          ? { specializations: query.specialization }
          : {}),
      })
      .populate('specializations')
      .populate('user', 'email')
      .sort({ createdAt: -1 });
  }

  async get(id: string) {
    const doctor = await this.model
      .findOne({ _id: id, active: true, published: true })
      .populate('specializations')
      .populate('user', 'email');

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  async me(userId: string) {
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Authenticated doctor user ID is invalid');
    }

    const doctor = await this.model
      .findOne({ user: new Types.ObjectId(userId) })
      .populate('specializations')
      .populate('user', 'email');

    if (!doctor) {
      throw new NotFoundException(
        'Your login is valid, but no doctor profile is linked to this account. Contact support to restore the doctor profile.',
      );
    }

    return doctor;
  }

  async update(userId: string, dto: any) {
    const update = { ...dto };

    if (update.specializationIds) {
      update.specializations = update.specializationIds;
      delete update.specializationIds;
    }

    const doctor = await this.model
      .findOneAndUpdate(
        { user: new Types.ObjectId(userId) },
        { $set: update },
        { new: true, runValidators: true },
      )
      .populate('specializations');

    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    return doctor;
  }
}
