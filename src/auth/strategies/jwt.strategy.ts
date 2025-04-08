import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key',
    });
  }

  /**
   * Validate the JWT payload and return the user object.
   * @param payload The JWT payload containing user information.
   * @returns The user object if found, otherwise null.
   */

  async validate(payload: { sub: string; email: string }) {
    const user = await this.usersService.findById(payload.sub);
    return { id: user.id, email: user.email };
  }
}
