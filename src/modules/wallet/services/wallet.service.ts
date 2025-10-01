import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, DataSource } from 'typeorm';
// import { Wallet } from '../entities/wallet.entity';
// import { Transaction, TransactionType, TransactionStatus } from '../../transactions/entities/transaction.entity';
import { DepositDto } from '../dto/deposit.dto';

// Mock data para desarrollo sin base de datos
export interface MockWallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  isActive: boolean;
}

export interface MockTransaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  description: string;
  reference?: string;
  balanceBefore: number;
  balanceAfter: number;
  userId: string;
  walletId: string;
  createdAt: Date;
}

@Injectable()
export class WalletService {
  private mockWallets: MockWallet[] = [
    {
      id: '1',
      userId: 'user1',
      balance: 1000,
      currency: 'USD',
      isActive: true,
    }
  ];

  private mockTransactions: MockTransaction[] = [];

  constructor(
    // @InjectRepository(Wallet)
    // private readonly walletRepository: Repository<Wallet>,
    // @InjectRepository(Transaction)
    // private readonly transactionRepository: Repository<Transaction>,
    // private readonly dataSource: DataSource,
  ) {}

  async findByUserId(userId: string): Promise<MockWallet> {
    const wallet = this.mockWallets.find(w => w.userId === userId);

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async getBalance(userId: string): Promise<{ balance: number; currency: string }> {
    const wallet = await this.findByUserId(userId);
    
    return {
      balance: wallet.balance,
      currency: wallet.currency,
    };
  }

  async deposit(depositDto: DepositDto, userId: string): Promise<MockTransaction> {
    const wallet = this.mockWallets.find(w => w.userId === userId);

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (!wallet.isActive || depositDto.amount <= 0) {
      throw new BadRequestException('Invalid deposit amount or wallet is inactive');
    }

    const balanceBefore = wallet.balance;
    const newBalance = balanceBefore + depositDto.amount;

    // Update wallet balance
    wallet.balance = newBalance;

    // Create transaction record
    const transaction: MockTransaction = {
      id: Date.now().toString(),
      amount: depositDto.amount,
      type: 'DEPOSIT',
      status: 'COMPLETED',
      description: depositDto.description || 'Wallet deposit',
      reference: depositDto.reference,
      balanceBefore,
      balanceAfter: newBalance,
      userId,
      walletId: wallet.id,
      createdAt: new Date(),
    };

    this.mockTransactions.push(transaction);
    
    return transaction;
  }

  async withdraw(amount: number, userId: string, description?: string): Promise<MockTransaction> {
    const wallet = this.mockWallets.find(w => w.userId === userId);

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (!wallet.isActive || wallet.balance < amount) {
      throw new BadRequestException('Insufficient funds or wallet is inactive');
    }

    const balanceBefore = wallet.balance;
    const newBalance = balanceBefore - amount;

    // Update wallet balance
    wallet.balance = newBalance;

    // Create transaction record
    const transaction: MockTransaction = {
      id: Date.now().toString(),
      amount,
      type: 'WITHDRAWAL',
      status: 'COMPLETED',
      description: description || 'Wallet withdrawal',
      balanceBefore,
      balanceAfter: newBalance,
      userId,
      walletId: wallet.id,
      createdAt: new Date(),
    };

    this.mockTransactions.push(transaction);
    
    return transaction;
  }

  async getTransactionHistory(userId: string, limit: number = 10, offset: number = 0): Promise<MockTransaction[]> {
    return this.mockTransactions
      .filter(t => t.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }
}
