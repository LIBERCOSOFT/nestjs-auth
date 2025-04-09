import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findOne: jest.fn(),
    create: jest.fn(),
    findByBiometricKey: jest.fn(),
    updateBiometricKey: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'test-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
      };
      mockUsersService.findOne.mockResolvedValue(user);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual({ id: '1', email: 'test@example.com' });
    });

    it('should return null when credentials are invalid', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
      };
      mockUsersService.findOne.mockResolvedValue(user);

      const result = await service.validateUser('test@example.com', 'wrong');
      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('should create a user and return token', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword',
      };
      mockUsersService.create.mockResolvedValue(user);

      const result = await service.register('test@example.com', 'password');
      expect(mockUsersService.create).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      );
      expect(result).toEqual({
        access_token: 'test-token',
        user: { id: '1', email: 'test@example.com' },
      });
    });
  });

  describe('validateBiometric', () => {
    it('should return user when biometric key is valid', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword',
        biometricKey: 'biometric123',
      };
      mockUsersService.findByBiometricKey.mockResolvedValue(user);

      const result = await service.validateBiometric('biometric123');
      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        biometricKey: 'biometric123',
      });
    });

    it('should throw an error when biometric key is invalid', async () => {
      mockUsersService.findByBiometricKey.mockResolvedValue(null);

      await expect(service.validateBiometric('invalid')).rejects.toThrow(
        'Invalid biometric key',
      );
    });
  });
});
