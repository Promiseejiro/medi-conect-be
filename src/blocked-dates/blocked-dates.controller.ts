import { Body, Controller, Get, Post, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BlockedDatesService } from './blocked-dates.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { authenticatedUserId } from '../common/utils/auth-user';
@ApiTags('Blocked dates') @Controller('blocked-dates')
export class BlockedDatesController {
  constructor(private service: BlockedDatesService) {}
  @Get() list(@Query('doctorId') id: string) { return this.service.list(id); }
  @Post() @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('DOCTOR') create(@CurrentUser() user: any, @Body() body: any) { return this.service.create(authenticatedUserId(user), body); }
  @Delete(':id') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('DOCTOR') remove(@CurrentUser() user: any, @Param('id') id: string) { return this.service.remove(authenticatedUserId(user), id); }
}
