import { Body, Controller, Get, Post, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { authenticatedUserId } from '../common/utils/auth-user';
@ApiTags('Appointments') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('appointments')
export class AppointmentsController {
  constructor(private service: AppointmentsService) {}
  @Post() create(@CurrentUser() user: any, @Body() body: any) { return this.service.create(authenticatedUserId(user), body); }
  @Get('mine') mine(@CurrentUser() user: any) { return this.service.listMine(authenticatedUserId(user), user.role); }
  @Patch(':id/cancel') cancel(@CurrentUser() user: any, @Param('id') id: string, @Body() body: any) { return this.service.cancel(authenticatedUserId(user), user.role, id, body?.reason); }
}
