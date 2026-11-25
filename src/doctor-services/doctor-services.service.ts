import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DoctorService, DoctorServiceDocument } from './schemas/doctor-service.schema';
import { Doctor, DoctorDocument } from '../doctors/schemas/doctor.schema';

@Injectable()
export class DoctorServicesService {
  constructor(
    @InjectModel(DoctorService.name)
    private readonly model: Model<DoctorServiceDocument>,
    @InjectModel(Doctor.name)
    private readonly doctors: Model<DoctorDocument>,
  ) {}

  private async migrateCurrencyToUsd() {
    await this.model.updateMany(
      { currency: { $ne: 'USD' } },
      { $set: { currency: 'USD' } },
    );
  }

  private async doctorFor(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Doctor profile not found for the signed-in account');
    }

    const doctor = await this.doctors.findOne({
      user: new Types.ObjectId(userId),
    });

    if (!doctor) {
      throw new NotFoundException('Doctor profile not found for the signed-in account');
    }

    return doctor;
  }

  async list(doctorId: string) {
    await this.migrateCurrencyToUsd();

    if (!doctorId || !Types.ObjectId.isValid(doctorId)) {
      return [];
    }

    return this.model
      .find({ doctor: new Types.ObjectId(doctorId), active: true })
      .sort({ createdAt: -1 });
  }

  async mine(userId: string) {
    await this.migrateCurrencyToUsd();
    const doctor = await this.doctorFor(userId);

    return this.model
      .find({ doctor: doctor._id })
      .sort({ createdAt: -1 });
  }

  async create(userId: string, body: any) {
    const doctor = await this.doctorFor(userId);
    const payload: any = { ...body, doctor: doctor._id };

    if (!payload.name?.trim()) {
      throw new BadRequestException('Service name is required');
    }

    if (!Number.isFinite(Number(payload.price)) || Number(payload.price) < 0) {
      throw new BadRequestException('A valid service price is required');
    }

    if (!['VIDEO', 'PHONE', 'IN_PERSON', 'ONLINE', 'PHYSICAL'].includes(payload.consultationType)) {
      throw new BadRequestException('consultationType must be VIDEO, PHONE, IN_PERSON, ONLINE or PHYSICAL');
    }

    payload.price = Number(payload.price);
    payload.currency = 'USD';
    payload.durationMinutes = Number(payload.durationMinutes ?? 30);

    return this.model.create(payload);
  }

  async update(userId: string, id: string, body: any) {
    const doctor = await this.doctorFor(userId);

    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Service not found');
    }

    const payload: any = { ...body };

    for (const key of ['_id', 'id', 'doctor', 'currency']) {
      delete payload[key];
    }

    if (
      payload.consultationType &&
      !['VIDEO', 'PHONE', 'IN_PERSON', 'ONLINE', 'PHYSICAL'].includes(payload.consultationType)
    ) {
      throw new BadRequestException('Invalid consultation type');
    }

    const service = await this.model.findOneAndUpdate(
      { _id: id, doctor: doctor._id },
      { $set: { ...payload, currency: 'USD' } },
      { new: true, runValidators: true },
    );

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async remove(userId: string, id: string) {
    return this.update(userId, id, { active: false });
  }
}
