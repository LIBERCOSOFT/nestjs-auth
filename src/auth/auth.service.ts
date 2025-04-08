import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // Exclude password from returned user
      const { ...safeUser } = user;
      return safeUser;
    }
    return null;
  }

  login(user: { id: string; email: string }) {
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
      user,
    };
  }

  async register(email: string, password: string) {
    const user = await this.usersService.create(email, password);
    const { ...safeUser } = user;
    return this.login(safeUser);
  }

  async validateBiometric(biometricKey: string) {
    const user = await this.usersService.findByBiometricKey(biometricKey);
    if (!user) {
      throw new UnauthorizedException('Invalid biometric key');
    }
    const { ...safeUser } = user;
    return safeUser;
  }

  async loginWithBiometric(biometricKey: string) {
    const user = await this.validateBiometric(biometricKey);
    return this.login(user);
  }

  async registerBiometric(userId: string, biometricKey: string) {
    const user = await this.usersService.updateBiometricKey(
      userId,
      biometricKey,
    );
    const { ...safeUser } = user;
    return safeUser;
  }
}
