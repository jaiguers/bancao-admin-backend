import { IsEnum, IsNumber, IsString, IsOptional, Min, IsUUID } from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsNumber({}, { message: 'Amount must be a valid number' })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;

  @IsEnum(TransactionType, { message: 'Invalid transaction type' })
  type: TransactionType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsUUID('4', { message: 'Wallet ID must be a valid UUID' })
  walletId: string;
}
