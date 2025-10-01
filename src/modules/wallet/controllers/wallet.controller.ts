import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WalletService } from '../services/wallet.service';
import { DepositDto } from '../dto/deposit.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { IAuthPayload } from '../../../common/interfaces/auth.interface';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  async getBalance(@CurrentUser() user: IAuthPayload) {
    return this.walletService.getBalance(user.sub);
  }

  @Post('deposit')
  @HttpCode(HttpStatus.CREATED)
  async deposit(
    @Body() depositDto: DepositDto,
    @CurrentUser() user: IAuthPayload,
  ) {
    return this.walletService.deposit(depositDto, user.sub);
  }

  @Post('withdraw')
  @HttpCode(HttpStatus.CREATED)
  async withdraw(
    @Body('amount') amount: number,
    @Body('description') description: string,
    @CurrentUser() user: IAuthPayload,
  ) {
    return this.walletService.withdraw(amount, user.sub, description);
  }

  @Get('history')
  async getTransactionHistory(
    @CurrentUser() user: IAuthPayload,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const offsetNum = offset ? parseInt(offset, 10) : 0;
    
    return this.walletService.getTransactionHistory(user.sub, limitNum, offsetNum);
  }
}
