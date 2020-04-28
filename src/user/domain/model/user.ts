import { AggregateRoot } from '../../../core/domain/models/aggregate-root';
import { UserId } from './user-id';
import { UserName } from './user-name';
import { UserEmail } from './user-email';

import { UserWasCreated } from '../event/user-was-created.event';
import { UserNameWasChanged } from '../event/user-name-was-changed.event';
import { UserPaypal } from './user-paypal';
import { UserPaypalWasChanged } from '../event/user-paypal-was-changed.event';

export class User extends AggregateRoot {
  private _userId: UserId;
  private _username: UserName;
  private _useremail: UserEmail;
  private _userpaypal: UserPaypal;

  private constructor() {
    super();
  }

  public static add(
    userId: UserId,
    name: UserName,
    email: UserEmail,
    userPaypal = UserPaypal.fromString(''),
  ): User {
    const user = new User();

    user.apply(
      new UserWasCreated(
        userId.value,
        name.value,
        email.value,
        userPaypal.value,
      ),
    );

    return user;
  }

  rename(name: UserName) {
    if (name.equals(this._username)) {
      return;
    }

    this.apply(new UserNameWasChanged(this._userId.value, name.value));
  }

  changePaypal(paypal: UserPaypal) {
    if (paypal.equals(this._userpaypal)) {
      return;
    }

    this.apply(new UserPaypalWasChanged(this._userId.value, paypal.value));
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

  get paypal(): UserPaypal {
    return this._userpaypal;
  }

  private onUserWasCreated(event: UserWasCreated) {
    this._userId = UserId.fromString(event.id);
    this._username = UserName.fromString(event.username);
    this._useremail = UserEmail.fromString(event.useremail);
    this._userpaypal = UserPaypal.fromString(event.userpaypal);
  }

  private onUserNameWasChanged(event: UserNameWasChanged) {
    this._username = UserName.fromString(event.username);
  }

  private onUserPaypalWasChanged(event: UserPaypalWasChanged) {
    this._userpaypal = UserPaypal.fromString(event.userpaypal);
  }
}
