export class UserNotFoundError extends Error {
  constructor() {
    super("User not found");
  }
}

export class InvalidPasswordError extends Error {
  constructor() {
    super("Invalid password");
  }
}

export class EmailAlreadyExistsError extends Error {
  constructor() {
    super("Email already exists");
  }
}
