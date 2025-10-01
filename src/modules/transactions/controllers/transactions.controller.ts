import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionStatus } from '../entities/transaction.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { IAuthPayload } from '../../../common/interfaces/auth.interface';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @CurrentUser() user: IAuthPayload,
  ) {
    return this.transactionsService.create(createTransactionDto, user.sub);
  }

  @Get()
  async findAll(
    @CurrentUser() user: IAuthPayload,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const offsetNum = offset ? parseInt(offset, 10) : 0;
    
    return this.transactionsService.findAll(user.sub, limitNum, offsetNum);
  }

  @Get('stats')
  async getStats(@CurrentUser() user: IAuthPayload) {
    return this.transactionsService.getTransactionStats(user.sub);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: IAuthPayload,
  ) {
    return this.transactionsService.findOne(id, user.sub);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: TransactionStatus,
    @CurrentUser() user: IAuthPayload,
  ) {
    return this.transactionsService.updateStatus(id, status, user.sub);
  }
}
