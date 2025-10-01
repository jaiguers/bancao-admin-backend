import { IsNumber, IsString, IsOptional, Min, IsUUID } from 'class-validator';

export class DepositDto {
  @IsNumber({}, { message: 'Amount must be a valid number' })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;

  @IsUUID('4', { message: 'Wallet ID must be a valid UUID' })
  walletId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  reference?: string;
}
