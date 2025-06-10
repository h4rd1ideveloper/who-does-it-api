import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { ServiceProvider } from '../database/entities/service-provider.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(User)
    private readonly serviceProviderRepository: Repository<ServiceProvider>,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email, userType: UserType.ADMIN },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPass = await bcrypt.compare(password, user.passwordHash);
    if (!validPass) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
      userType: user.userType,
    };
  }

  async validateServiceProvider(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email, userType: UserType.SERVICE_PROVIDER },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPass = await bcrypt.compare(password, user.passwordHash);
    if (!validPass) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const serviceProvider = await this.serviceProviderRepository.findOne({
      where: { id: user.id },
    });

    if (!serviceProvider || !serviceProvider.isActive) {
      throw new UnauthorizedException('Service provider inactive or not found');
    }

    return {
      id: user.id,
      email: user.email,
      userType: user.userType,
      serviceProviderId: serviceProvider.id,
    };
  }

  async loginAdmin(email: string, password: string) {
    const user = await this.validateAdmin(email, password);
    const payload = {
      sub: user.id,
      email: user.email,
      userType: user.userType,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async loginServiceProvider(email: string, password: string) {
    const user = await this.validateServiceProvider(email, password);
    const payload = {
      sub: user.id,
      email: user.email,
      userType: user.userType,
    };
    return {
      token: this.jwtService.sign(payload),
      serviceProviderId: user.serviceProviderId,
    };
  }
}
