import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import {
  User,
  UserDocument,
  UserRole,
} from '../users/schemas/user.schema';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import {
  Patient,
  PatientDocument,
} from '../patients/schemas/patient.schema';

import {
  Doctor,
  DoctorDocument,
} from '../doctors/schemas/doctor.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private users: Model<UserDocument>,

    @InjectModel(Patient.name)
    private patients: Model<PatientDocument>,

    @InjectModel(Doctor.name)
    private doctors: Model<DoctorDocument>,

    private jwt: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();

    if (await this.users.exists({ email })) {
      throw new ConflictException(
        'An account with this email already exists',
      );
    }

    const role =
      dto.role === UserRole.DOCTOR
        ? UserRole.DOCTOR
        : UserRole.PATIENT;

    if (dto.role === UserRole.ADMIN) {
      throw new BadRequestException(
        'Admin accounts cannot be self-registered',
      );
    }

    const user = await this.users.create({
      email,
      passwordHash: await bcrypt.hash(dto.password, 12),
      role,
    });

    const profile = {
      user: user._id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
    };

    if (role === UserRole.PATIENT) {
      await this.patients.create(profile);
    } else {
      await this.doctors.create({
        ...profile,
        qualification: dto.qualification,
        experienceYears: dto.experienceYears,
        bio: dto.bio,
        clinicAddress: dto.clinicAddress,
        published: false,
      });
    }

    return this.issueToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.users
      .findOne({
        email: dto.email.toLowerCase().trim(),
      })
      .select('+passwordHash');

    if (
      !user ||
      !(await bcrypt.compare(dto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Your account has been deactivated',
      );
    }

    user.lastLoginAt = new Date();

    await user.save();

    return this.issueToken(user);
  }

  private async issueToken(user: UserDocument) {
    const accessToken = await this.jwt.signAsync({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      message: 'Authentication successful',
      data: {
        accessToken,
        tokenType: 'Bearer',
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      },
    };
  }
}