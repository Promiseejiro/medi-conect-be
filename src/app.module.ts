import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PatientsModule } from './patients/patients.module';
import { DoctorsModule } from './doctors/doctors.module';
import { SpecializationsModule } from './specializations/specializations.module';
import { DoctorServicesModule } from './doctor-services/doctor-services.module';
import { AvailabilityModule } from './availability/availability.module';
import { BlockedDatesModule } from './blocked-dates/blocked-dates.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HealthModule } from './health/health.module';

@Module({ imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, AuthModule, UsersModule, PatientsModule, DoctorsModule, SpecializationsModule, DoctorServicesModule, AvailabilityModule, BlockedDatesModule, AppointmentsModule, PaymentsModule, NotificationsModule, HealthModule] })
export class AppModule {}
