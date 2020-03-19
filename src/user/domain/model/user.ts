import { AggregateRoot } from '../../../core/domain/models/aggregate-root';
import { UserId } from './user-id';
import { UserName } from './user-name';
import { UserEmail } from './user-email';

import { UserWasRegistered } from '../event/user-was-registered.event';
import { UsernameWasChanged } from '../event/username-was-changed.event';
import { UseremailWasChanged } from '../event/useremail-was-changed.event';

export class User extends AggregateRoot {
  private _userId: UserId;
  private _username: UserName;
  private _useremail: UserEmail;

  private constructor() {
    super();
  }

  public static add(
    userId: UserId,
    name: UserName,
    email: UserEmail,
  ): User {
    const user = new User();

    user.apply(new UserWasRegistered(userId.value, name.value, email.value));

    return user;
  }

  aggregateId(): string {
    return this._userId.value;
  }

  get id(): UserId{
    return this._userId;
  }

  get name(): UserName{
    return this._username;
  }

  get email(): UserEmail{
    return this._useremail;
  }

  changeUsername(username: UserName) {
    if (username.equals(this._username)) {
      return;
    }

    this.apply(new UsernameWasChanged(this.id.value, username.value));
  }

  changeUseremail(useremail: UserEmail) {
    if (useremail.equals(this._useremail)) {
      return;
    }

    this.apply(new UseremailWasChanged(this.id.value, useremail.value));
  }

  private onUserWasRegistered(event: UserWasRegistered) {
    this._userId = UserId.fromString(event.id);
    this._username = UserName.fromString(event.username);
    this._useremail = UserEmail.fromString(event.useremail);
  }

  private onUsernameWasChanged(event: UsernameWasChanged) {
    this._username = UserName.fromString(event.username);
  }

  private onUseremailWasChanged(event: UseremailWasChanged) {
    this._useremail = UserEmail.fromString(event.useremail);
  }
}
