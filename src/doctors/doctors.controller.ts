import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  list(@Query() query: any) {
    return this.doctorsService.list(query);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  me(@CurrentUser() user: any) {
    return this.doctorsService.me(user.id ?? user.userId ?? user.sub);
  }

  @Patch('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  update(@CurrentUser() user: any, @Body() body: any) {
    return this.doctorsService.update(user.id ?? user.userId ?? user.sub, body);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.doctorsService.get(id);
  }
}
