import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { BiometricInput } from './dto/biometric.input';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  const mockAuthService = {
    register: jest
      .fn()
      .mockImplementation((email: string, password: string) => {
        void password;
        return Promise.resolve({
          access_token: 'token123',
          user: { id: '1', email },
        });
      }),

    validateUser: jest.fn(),
    login: jest.fn(),
    loginWithBiometric: jest.fn(),
    registerBiometric: jest.fn(),
    validateBiometric: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with correct inputs', async () => {
      const registerInput: RegisterInput = {
        email: 'test@example.com',
        password: 'password123',
      };
      mockAuthService.register.mockResolvedValue({
        access_token: 'token123',
        user: { id: '1', email: 'test@example.com' },
      });

      const result = await resolver.register(registerInput);
      expect(mockAuthService.register).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(result).toEqual({
        access_token: 'token123',
        user: { id: '1', email: 'test@example.com' },
      });
    });
  });

  describe('login', () => {
    it('should return token when credentials are valid', async () => {
      const loginInput: LoginInput = {
        email: 'test@example.com',
        password: 'password123',
      };
      const user = { id: '1', email: 'test@example.com' };
      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue({
        access_token: 'token123',
        user,
      });

      const result = await resolver.login(loginInput);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
      expect(result).toEqual({
        access_token: 'token123',
        user: { id: '1', email: 'test@example.com' },
      });
    });

    it('should throw error when credentials are invalid', async () => {
      const loginInput: LoginInput = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(resolver.login(loginInput)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('loginWithBiometric', () => {
    it('should call authService.loginWithBiometric with correct input', async () => {
      const biometricInput: BiometricInput = {
        biometricKey: 'biometric123',
      };
      mockAuthService.loginWithBiometric.mockResolvedValue({
        access_token: 'token123',
        user: { id: '1', email: 'test@example.com' },
      });

      const result = await resolver.loginWithBiometric(biometricInput);
      expect(mockAuthService.loginWithBiometric).toHaveBeenCalledWith(
        'biometric123',
      );
      expect(result).toEqual({
        access_token: 'token123',
        user: { id: '1', email: 'test@example.com' },
      });
    });
  });
});
