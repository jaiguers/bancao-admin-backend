import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { IAuthPayload } from '../../../common/interfaces/auth.interface';
import { UserRole } from '../entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() user: IAuthPayload,
  ) {
    // Only admin users can create new users
    if (user.role !== UserRole.ADMIN) {
      throw new Error('Insufficient permissions');
    }

    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(@CurrentUser() user: IAuthPayload) {
    // Only admin users can list all users
    if (user.role !== UserRole.ADMIN) {
      throw new Error('Insufficient permissions');
    }

    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: IAuthPayload,
  ) {
    // Users can only view their own profile, admins can view any profile
    if (user.role !== UserRole.ADMIN && user.sub !== id) {
      throw new Error('Insufficient permissions');
    }

    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: IAuthPayload,
  ) {
    // Users can only update their own profile, admins can update any profile
    if (user.role !== UserRole.ADMIN && user.sub !== id) {
      throw new Error('Insufficient permissions');
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: IAuthPayload,
  ) {
    // Only admin users can delete users
    if (user.role !== UserRole.ADMIN) {
      throw new Error('Insufficient permissions');
    }

    await this.usersService.remove(id);
  }
}
