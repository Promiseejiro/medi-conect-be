import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Patient, PatientSchema } from '../patients/schemas/patient.schema';
import { Doctor, DoctorSchema } from '../doctors/schemas/doctor.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
@Module({
 imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Patient.name, schema: PatientSchema }, { name: Doctor.name, schema: DoctorSchema }]), PassportModule, JwtModule.registerAsync({ inject: [ConfigService], useFactory: (c: ConfigService) => ({ secret: c.get('JWT_SECRET'), signOptions: { expiresIn: c.get('JWT_EXPIRES_IN', '1d') } }) })],
 controllers: [AuthController], providers: [AuthService, JwtStrategy], exports: [JwtModule]
})
export class AuthModule {}
