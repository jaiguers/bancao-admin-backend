import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
// import { User } from './entities/user.entity';
// import { Wallet } from '../wallet/entities/wallet.entity';

@Module({
  imports: [
    // TypeOrmModule.forFeature([User, Wallet])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
