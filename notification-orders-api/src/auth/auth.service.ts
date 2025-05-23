import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  async login(userId: number) {
    // Crea o busca al usuario (simplificado para este ejemplo)
    let user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      user = this.userRepo.create({ id: userId, name: `User_${userId}` });
      user = await this.userRepo.save(user);
    }

    const payload = { sub: user.id };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
