import { AggregateRoot } from '../../../core/domain/models/aggregate-root';
import { UserId } from './user-id';
import { UserName } from './user-name';
import { UserEmail } from './user-email';

import { UserWasCreated } from '../event/user-was-created.event';

export class User extends AggregateRoot {
  private _userId: UserId;
  private _username: UserName;
  private _useremail: UserEmail;

  private constructor() {
    super();
  }

  public static add(userId: UserId, name: UserName, email: UserEmail): User {
    const user = new User();

    user.apply(new UserWasCreated(userId.value, name.value, email.value));

    return user;
  }

  aggregateId(): string {
    return this._userId.value;
  }

  get id(): UserId {
    return this._userId;
  }

  get name(): UserName {
    return this._username;
  }

  get email(): UserEmail {
    return this._useremail;
  }

  private onUserWasCreated(event: UserWasCreated) {
    this._userId = UserId.fromString(event.id);
    this._username = UserName.fromString(event.username);
    this._useremail = UserEmail.fromString(event.useremail);
  }
}
