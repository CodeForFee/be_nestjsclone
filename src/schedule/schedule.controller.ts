import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { JWTUserType } from '../utils/type'; // Import JWT User Type
import { Role } from '../enum/roles.enum'; // Import Role Enum

@ApiTags('Schedules')
@ApiBearerAuth()
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new schedule (admin, employee only)' })
  @ApiResponse({ status: 201, description: 'Schedule created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createScheduleDto: CreateScheduleDto, @Req() req) {
    const user = req.user as JWTUserType;
    if (user.role_id !== Role.ADMIN && user.role_id !== Role.EMPLOYEE) {
      throw new ForbiddenException(
        'Unauthorized: Only admin or employee can create a schedule.',
      );
    }
    return await this.scheduleService.create(createScheduleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all schedules' })
  @ApiResponse({ status: 200, description: 'List of schedules.' })
  async findAll() {
    return await this.scheduleService.find();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get schedule by ID' })
  @ApiResponse({ status: 200, description: 'Schedule found.' })
  async findOut(@Param('id') id: number) {
    return await this.scheduleService.findOut(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update schedule by ID (admin, employee only)' })
  @ApiResponse({ status: 200, description: 'Schedule updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async update(
    @Param('id') id: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
    @Req() req,
  ) {
    const user = req.user as JWTUserType;
    if (user.role_id !== Role.ADMIN && user.role_id !== Role.EMPLOYEE) {
      throw new ForbiddenException(
        'Unauthorized: Only admin or employee can update a schedule.',
      );
    }
    return await this.scheduleService.update(id, updateScheduleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete schedule by ID (admin, employee only)' })
  @ApiResponse({ status: 200, description: 'Schedule deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async remove(@Param('id') id: number, @Req() req) {
    const user = req.user as JWTUserType;
    if (user.role_id !== Role.ADMIN && user.role_id !== Role.EMPLOYEE) {
      throw new ForbiddenException(
        'Unauthorized: Only admin or employee can delete a schedule.',
      );
    }
    return await this.scheduleService.softDelete(id);
  }
}
