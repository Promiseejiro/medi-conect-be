import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { Patient, PatientDocument } from '../patients/schemas/patient.schema';
import { Doctor, DoctorDocument } from '../doctors/schemas/doctor.schema';
import { DoctorService, DoctorServiceDocument } from '../doctor-services/schemas/doctor-service.schema';
import { Availability, AvailabilityDocument } from '../availability/schemas/availability.schema';
import { BlockedDate, BlockedDateDocument } from '../blocked-dates/schemas/blocked-date.schema';
@Injectable()
export class AppointmentsService {
  constructor(@InjectModel(Appointment.name) private model: Model<AppointmentDocument>, @InjectModel(Patient.name) private patients: Model<PatientDocument>, @InjectModel(Doctor.name) private doctors: Model<DoctorDocument>, @InjectModel(DoctorService.name) private services: Model<DoctorServiceDocument>, @InjectModel(Availability.name) private availability: Model<AvailabilityDocument>, @InjectModel(BlockedDate.name) private blocked: Model<BlockedDateDocument>) {}
  async create(userId: string, body: any) {
    if (!Types.ObjectId.isValid(body?.doctorId) || !Types.ObjectId.isValid(body?.serviceId)) throw new BadRequestException('A valid doctorId and serviceId are required');
    const patient = await this.patients.findOne({ user: new Types.ObjectId(userId) });
    if (!patient) throw new ForbiddenException('A patient account is required to book an appointment');
    const doctor = await this.doctors.findOne({ _id: body.doctorId, active: true, published: true });
    if (!doctor) throw new NotFoundException('Doctor not found or not accepting appointments');
    const service = await this.services.findOne({ _id: body.serviceId, doctor: doctor._id, active: true });
    if (!service) throw new NotFoundException('Active doctor service not found');
    const start = new Date(body.startsAt);
    if (!body.startsAt || Number.isNaN(start.getTime()) || start <= new Date()) throw new BadRequestException('Appointment must be scheduled in the future');
    const end = new Date(start.getTime() + service.durationMinutes * 60000);
    const day = start.getUTCDay();
    const hhmm = start.toISOString().slice(11,16);
    const endHHMM = end.toISOString().slice(11,16);
    const slot = await this.availability.findOne({ doctor: doctor._id, dayOfWeek: day, active: true, startTime: { $lte: hhmm }, endTime: { $gte: endHHMM } });
    if (!slot) throw new BadRequestException('Doctor is not available at the selected time');
    const dayStart = new Date(start); dayStart.setUTCHours(0,0,0,0);
    const dayEnd = new Date(dayStart); dayEnd.setUTCDate(dayEnd.getUTCDate()+1);
    if (await this.blocked.exists({ doctor: doctor._id, active: true, date: { $gte: dayStart, $lt: dayEnd } })) throw new BadRequestException('Doctor is unavailable on this date');
    if (await this.model.exists({ doctor: doctor._id, status: { $in: ['PENDING','CONFIRMED'] }, startsAt: { $lt: end }, endsAt: { $gt: start } })) throw new BadRequestException('This appointment time has already been booked');
    const appointment = await this.model.create({ patient: patient._id, doctor: doctor._id, service: service._id, startsAt: start, endsAt: end, status: 'PENDING', paymentStatus: service.paymentRequired ? 'UNPAID' : 'UNPAID' });
    return this.model.findById(appointment._id).populate('patient').populate('doctor').populate('service');
  }
  async listMine(userId: string, role: string) {
    let filter: any;
    if (role === 'PATIENT') { const patient = await this.patients.findOne({ user: new Types.ObjectId(userId) }); if (!patient) return []; filter = { patient: patient._id }; }
    else if (role === 'DOCTOR') { const doctor = await this.doctors.findOne({ user: new Types.ObjectId(userId) }); if (!doctor) return []; filter = { doctor: doctor._id }; }
    else throw new ForbiddenException('This account cannot access personal appointments');
    return this.model.find(filter).populate('patient').populate('doctor').populate('service').sort({ startsAt: -1 });
  }
  async cancel(userId: string, role: string, id: string, reason?: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Appointment not found');
    const appointment = await this.model.findById(id); if (!appointment) throw new NotFoundException('Appointment not found');
    if (role === 'PATIENT') { const patient = await this.patients.findOne({ user: new Types.ObjectId(userId) }); if (!patient || appointment.patient.toString() !== patient._id.toString()) throw new ForbiddenException('You cannot cancel this appointment'); }
    else if (role === 'DOCTOR') { const doctor = await this.doctors.findOne({ user: new Types.ObjectId(userId) }); if (!doctor || appointment.doctor.toString() !== doctor._id.toString()) throw new ForbiddenException('You cannot cancel this appointment'); }
    else throw new ForbiddenException('You cannot cancel this appointment');
    if (['CANCELLED','COMPLETED','REJECTED'].includes(appointment.status)) throw new BadRequestException('Appointment cannot be cancelled');
    appointment.status = 'CANCELLED'; appointment.cancellationReason = reason; await appointment.save();
    return this.model.findById(appointment._id).populate('patient').populate('doctor').populate('service');
  }
}
