import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    // Clean database before each test
    await prismaService.user.deleteMany({});
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  it('should register a new user', async () => {
    const registerMutation = `
      mutation {
        register(input: {
          email: "test@example.com",
          password: "password123"
        }) {
          access_token
          user {
            id
            email
          }
        }
      }
    `;

    interface RegisterResponse {
      data: {
        register: {
          access_token: string;
          user: {
            id: string;
            email: string;
          };
        };
      };
    }

    const response = await request(
      app.getHttpServer() as unknown as import('http').Server,
    )
      .post('/graphql')
      .send({
        query: registerMutation,
      })
      .expect(200);

    const responseBody: RegisterResponse = response.body as RegisterResponse;

    expect(responseBody.data.register).toHaveProperty('access_token');
    expect(responseBody.data.register.user.email).toBe('test@example.com');
  });

  it('should login with valid credentials', async () => {
    // First register a user
    const registerMutation = `
      mutation {
        register(input: {
          email: "login-test@example.com",
          password: "password123"
        }) {
          access_token
        }
      }
    `;

    await request(app.getHttpServer() as unknown as import('http').Server)
      .post('/graphql')
      .send({
        query: registerMutation,
      });

    // Then try to login
    const loginMutation = `
      mutation {
        login(input: {
          email: "login-test@example.com",
          password: "password123"
        }) {
          access_token
          user {
            id
            email
          }
        }
      }
    `;

    interface LoginResponse {
      data: {
        login: {
          access_token: string;
          user: {
            id: string;
            email: string;
          };
        };
      };
    }

    const response = await request(
      app.getHttpServer() as unknown as import('http').Server,
    )
      .post('/graphql')
      .send({
        query: loginMutation,
      })
      .expect(200);

    const responseBody: LoginResponse = response.body as LoginResponse;

    expect(responseBody.data.login).toHaveProperty('access_token');
    expect(responseBody.data.login.user.email).toBe('login-test@example.com');
  });

  it('should fail login with invalid credentials', async () => {
    // First register a user
    const registerMutation = `
      mutation {
        register(input: {
          email: "failed-login@example.com",
          password: "password123"
        }) {
          access_token
        }
      }
    `;

    await request(app.getHttpServer() as unknown as import('http').Server)
      .post('/graphql')
      .send({
        query: registerMutation,
      });

    // Then try to login with wrong password
    const loginMutation = `
      mutation {
        login(input: {
          email: "failed-login@example.com",
          password: "wrongpassword"
        }) {
          access_token
          user {
            id
            email
          }
        }
      }
    `;

    const response = await request(
      app.getHttpServer() as unknown as import('http').Server,
    )
      .post('/graphql')
      .send({
        query: loginMutation,
      })
      .expect(200);

    interface ErrorResponse {
      errors: { message: string }[];
    }

    const responseBody: ErrorResponse = response.body as ErrorResponse;

    expect(responseBody.errors).toBeDefined();
    expect(responseBody.errors[0].message).toContain('Invalid credentials');
  });

  it('should register and use biometric key', async () => {
    // Register a user first
    const registerMutation = `
      mutation {
        register(input: {
          email: "biometric@example.com",
          password: "password123"
        }) {
          access_token
          user {
            id
          }
        }
      }
    `;

    interface RegisterResponse {
      data: {
        register: {
          access_token: string;
          user: {
            id: string;
          };
        };
      };
    }

    const registerResponse = await request(
      app.getHttpServer() as unknown as import('http').Server,
    )
      .post('/graphql')
      .send({
        query: registerMutation,
      });

    const responseBody: RegisterResponse =
      registerResponse.body as RegisterResponse;
    const token = responseBody.data.register.access_token;

    // Register biometric key
    const biometricMutation = `
      mutation {
        registerBiometric(input: {
          biometricKey: "test-biometric-key-12345"
        }) {
          id
          email
          biometricKey
        }
      }
    `;

    interface BiometricResponse {
      data: {
        registerBiometric: {
          id: string;
          email: string;
          biometricKey: string;
        };
      };
    }

    const biometricResponse = await request(
      app.getHttpServer() as unknown as import('http').Server,
    )
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: biometricMutation,
      })
      .expect(200);

    const biometricResponseBody: BiometricResponse =
      biometricResponse.body as BiometricResponse;

    expect(biometricResponseBody.data.registerBiometric.biometricKey).toBe(
      'test-biometric-key-12345',
    );

    // Login with biometric key
    const biometricLoginMutation = `
      mutation {
        loginWithBiometric(input: {
          biometricKey: "test-biometric-key-12345"
        }) {
          access_token
          user {
            email
          }
        }
      }
    `;

    interface BiometricLoginResponse {
      data: {
        loginWithBiometric: {
          access_token: string;
          user: {
            email: string;
          };
        };
      };
    }

    const loginResponse = await request(
      app.getHttpServer() as unknown as import('http').Server,
    )
      .post('/graphql')
      .send({
        query: biometricLoginMutation,
      })
      .expect(200);

    const loginResponseBody: BiometricLoginResponse =
      loginResponse.body as BiometricLoginResponse;

    expect(loginResponseBody.data.loginWithBiometric).toHaveProperty(
      'access_token',
    );
    expect(loginResponseBody.data.loginWithBiometric.user.email).toBe(
      'biometric@example.com',
    );
  });
});
