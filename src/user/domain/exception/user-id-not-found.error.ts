import { UserId } from '../model';

export class UserIdNotFoundError extends Error {
  static withUserId(userId: UserId): UserIdNotFoundError {
    return new this(`User with id ${userId.value} cannot be found.`);
  }
}