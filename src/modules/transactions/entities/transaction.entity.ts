import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  reference: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  balanceBefore: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  balanceAfter: number;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  @JoinColumn()
  wallet: Wallet;

  @Column()
  walletId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Business logic methods
  isCompleted(): boolean {
    return this.status === TransactionStatus.COMPLETED;
  }

  isPending(): boolean {
    return this.status === TransactionStatus.PENDING;
  }

  canBeCancelled(): boolean {
    return this.status === TransactionStatus.PENDING;
  }
}
