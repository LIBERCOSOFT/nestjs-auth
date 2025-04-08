import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login.response';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { BiometricInput } from './dto/biometric.input';
import { JwtAuthGuard } from './guards//jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../models/user.model';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async register(@Args('input') registerInput: RegisterInput) {
    return this.authService.register(
      registerInput.email,
      registerInput.password,
    );
  }

  @Mutation(() => LoginResponse)
  async login(@Args('input') loginInput: LoginInput) {
    const user = await this.authService.validateUser(
      loginInput.email,
      loginInput.password,
    );
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Mutation(() => LoginResponse)
  async loginWithBiometric(@Args('input') biometricInput: BiometricInput) {
    return this.authService.loginWithBiometric(biometricInput.biometricKey);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async registerBiometric(
    @CurrentUser() currentUser: { id: string },
    @Args('input') biometricInput: BiometricInput,
  ) {
    return this.authService.registerBiometric(
      currentUser.id,
      biometricInput.biometricKey,
    );
  }
}
