import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PatientsService } from './patients.service';

@ApiTags('Patients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly service: PatientsService) {}

  @Get('me')
  async me(@CurrentUser() user: any) {
    return {
      message: 'Patient profile',
      data: await this.service.me(user.id),
    };
  }

  @Patch('me')
  async update(@CurrentUser() user: any, @Body() body: any) {
    return {
      message: 'Patient profile updated',
      data: await this.service.update(user.id, body),
    };
  }
}
