import { Body, Controller, Get, Post, Patch, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DoctorServicesService } from './doctor-services.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { authenticatedUserId } from '../common/utils/auth-user';
@ApiTags('Doctor services') @Controller('doctor-services')
export class DoctorServicesController {
  constructor(private readonly service: DoctorServicesService) {}
  @Get() list(@Query('doctorId') id: string) { return this.service.list(id); }
  @Get('mine') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('DOCTOR') mine(@CurrentUser() user: any) { return this.service.mine(authenticatedUserId(user)); }
  @Post() @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('DOCTOR') create(@CurrentUser() user: any, @Body() body: any) { return this.service.create(authenticatedUserId(user), body); }
  @Patch(':id') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('DOCTOR') update(@CurrentUser() user: any, @Param('id') id: string, @Body() body: any) { return this.service.update(authenticatedUserId(user), id, body); }
  @Delete(':id') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('DOCTOR') remove(@CurrentUser() user: any, @Param('id') id: string) { return this.service.remove(authenticatedUserId(user), id); }
}
 