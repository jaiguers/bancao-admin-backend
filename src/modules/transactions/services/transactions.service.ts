import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { TransactionType, TransactionStatus } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
// import { Wallet } from '../../wallet/entities/wallet.entity';

// Mock interfaces para desarrollo sin base de datos
export interface MockTransaction {
  id: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description?: string;
  reference?: string;
  balanceBefore: number;
  balanceAfter?: number;
  userId: string;
  walletId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockWallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  isActive: boolean;
}

@Injectable()
export class TransactionsService {
  private mockTransactions: MockTransaction[] = [];
  private mockWallets: MockWallet[] = [
    {
      id: '1',
      userId: 'user1',
      balance: 1000,
      currency: 'USD',
      isActive: true,
    }
  ];

  constructor(
    // @InjectRepository(Transaction)
    // private readonly transactionRepository: Repository<Transaction>,
    // @InjectRepository(Wallet)
    // private readonly walletRepository: Repository<Wallet>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string): Promise<MockTransaction> {
    const wallet = this.mockWallets.find(w => w.id === createTransactionDto.walletId && w.userId === userId);

    if (!wallet) {
      throw new NotFoundException('Wallet not found or access denied');
    }

    // Validate transaction based on type
    if (createTransactionDto.type === TransactionType.WITHDRAWAL) {
      if (!wallet.isActive || wallet.balance < createTransactionDto.amount) {
        throw new BadRequestException('Insufficient funds or wallet is inactive');
      }
    }

    const transaction: MockTransaction = {
      id: Date.now().toString(),
      ...createTransactionDto,
      userId,
      status: TransactionStatus.PENDING,
      balanceBefore: wallet.balance,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockTransactions.push(transaction);
    return transaction;
  }

  async findAll(userId: string, limit: number = 10, offset: number = 0): Promise<MockTransaction[]> {
    return this.mockTransactions
      .filter(t => t.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }

  async findOne(id: string, userId: string): Promise<MockTransaction> {
    const transaction = this.mockTransactions.find(t => t.id === id && t.userId === userId);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
    userId: string,
  ): Promise<MockTransaction> {
    const transaction = await this.findOne(id, userId);

    // Simple validation - can only cancel pending transactions
    if (transaction.status !== TransactionStatus.PENDING && status === TransactionStatus.CANCELLED) {
      throw new BadRequestException('Transaction cannot be cancelled');
    }

    transaction.status = status;
    transaction.updatedAt = new Date();
    return transaction;
  }

  async getTransactionStats(userId: string): Promise<{
    totalTransactions: number;
    totalDeposits: number;
    totalWithdrawals: number;
    totalAmount: number;
  }> {
    const transactions = this.mockTransactions.filter(t => t.userId === userId && t.status === TransactionStatus.COMPLETED);

    const stats = transactions.reduce(
      (acc, transaction) => {
        acc.totalTransactions++;
        acc.totalAmount += transaction.amount;

        if (transaction.type === TransactionType.DEPOSIT) {
          acc.totalDeposits += transaction.amount;
        } else if (transaction.type === TransactionType.WITHDRAWAL) {
          acc.totalWithdrawals += transaction.amount;
        }

        return acc;
      },
      {
        totalTransactions: 0,
        totalDeposits: 0,
        totalWithdrawals: 0,
        totalAmount: 0,
      },
    );

    return stats;
  }
}
