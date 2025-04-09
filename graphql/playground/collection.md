# GraphQL Playground Collection

Below are sample GraphQL operations you can use to test the API functionality:

## User Registration

```graphql
mutation Register {
  register(
    input: {
      email: "user@example.com"
      password: "securePassword123"
    }
  ) {
    access_token
    user {
      id
      email
      createdAt
    }
  }
}
```

## User Login

```graphql
mutation Login {
  login(
    input: {
      email: "user@example.com"
      password: "securePassword123"
    }
  ) {
    access_token
    user {
      id
      email
    }
  }
}
```

## Register Biometric Key
(Requires JWT authentication - make sure to set the Authorization header)
{
  "Authorization": "Bearer <your-jwt-token>"
}


```graphql
mutation RegisterBiometric {
  registerBiometric(
    input: {
      biometricKey: "unique-biometric-key-sample-12345"
    }
  ) {
    id
    email
    biometricKey
    updatedAt
  }
}
```

## Login with Biometric Key

```graphql
mutation BiometricLogin {
  loginWithBiometric(
    input: {
      biometricKey: "unique-biometric-key-sample-12345"
    }
  ) {
    access_token
    user {
      id
      email
    }
  }
}
```

## Get Current User
(Requires JWT authentication - make sure to set the Authorization header)

```graphql
query Me {
  me {
    id
    email
    biometricKey
    createdAt
    updatedAt
  }
}
```

## HTTP Headers for Authentication

When making authenticated requests, include the JWT token in the HTTP headers:

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```