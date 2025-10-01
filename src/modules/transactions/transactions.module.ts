import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './services/transactions.service';
import { TransactionsController } from './controllers/transactions.controller';
// import { Transaction } from './entities/transaction.entity';
// import { Wallet } from '../wallet/entities/wallet.entity';

@Module({
  imports: [
    // TypeOrmModule.forFeature([Transaction, Wallet])
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
