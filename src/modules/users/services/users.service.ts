import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
// import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IUser, IUserWithPassword } from '../../../common/interfaces/user.interface';
// import { Wallet } from '../../wallet/entities/wallet.entity';

// Mock interfaces para desarrollo sin base de datos
export interface MockUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
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
export class UsersService {
  private mockUsers: MockUser[] = [
    {
      id: 'user1',
      email: 'admin@bancao.com',
      password: '$2a$10$rQZ8K9vX8K9vX8K9vX8K9e', // hashed 'password123'
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

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
    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,
    // @InjectRepository(Wallet)
    // private readonly walletRepository: Repository<Wallet>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const existingUser = this.mockUsers.find(u => u.email === createUserDto.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user: MockUser = {
      id: Date.now().toString(),
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || UserRole.USER, // Establecer role por defecto como USER si no se proporciona
      isActive: true, // Establecer isActive por defecto como true para nuevos usuarios
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockUsers.push(user);

    // Create wallet for the new user
    this.createWalletForUser(user.id);

    return this.mapUserToInterface(user);
  }

  async findAll(): Promise<IUser[]> {
    return this.mockUsers.map(user => this.mapUserToInterface(user));
  }

  async findOne(id: string): Promise<IUser> {
    const user = this.mockUsers.find(u => u.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.mapUserToInterface(user);
  }

  async findByEmail(email: string): Promise<IUserWithPassword | null> {
    const user = this.mockUsers.find(u => u.email === email);

    return user ? this.mapUserToInterfaceWithPassword(user) : null;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    const user = this.mockUsers.find(u => u.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);
    user.updatedAt = new Date();

    return this.mapUserToInterface(user);
  }

  async remove(id: string): Promise<void> {
    const userIndex = this.mockUsers.findIndex(u => u.id === id);

    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    this.mockUsers.splice(userIndex, 1);
  }

  async validatePassword(user: IUserWithPassword, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  private createWalletForUser(userId: string): void {
    const wallet: MockWallet = {
      id: Date.now().toString(),
      userId,
      balance: 0,
      currency: 'USD',
      isActive: true,
    };

    this.mockWallets.push(wallet);
  }

  private mapUserToInterface(user: MockUser): IUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private mapUserToInterfaceWithPassword(user: MockUser): IUserWithPassword {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
