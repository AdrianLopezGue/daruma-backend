import { AggregateRoot } from '../../../core/domain/models/aggregate-root';
import { UserId } from './user-id';
import { Username } from './username';
import { Useremail } from './useremail';

import { UserWasRegistered } from '../event/user-was-registered.event';
import { UsernameWasChanged } from '../event/username-was-changed.event';
import { UseremailWasChanged } from '../event/useremail-was-changed.event';

export class User extends AggregateRoot {
  private _userId: UserId;
  private _username: Username;
  private _useremail: Useremail;

  private constructor() {
    super();
  }

  public static add(
    userId: UserId,
    name: Username,
    email: Useremail,
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

  get name(): Username{
    return this._username;
  }

  get email(): Useremail{
    return this._useremail;
  }

  changeUsername(username: Username) {
    if (username.equals(this._username)) {
      return;
    }

    this.apply(new UsernameWasChanged(this.id.value, username.value));
  }

  changeUseremail(useremail: Useremail) {
    if (useremail.equals(this._username)) {
      return;
    }

    this.apply(new UsernameWasChanged(this.id.value, useremail.value));
  }

  private onUserWasRegistered(event: UserWasRegistered) {
    this._userId = UserId.fromString(event.id);
    this._username = Username.fromString(event.username);
    this._useremail = Useremail.fromString(event.useremail);
  }

  private onUsernameWasChanged(event: UsernameWasChanged) {
    this._username = Username.fromString(event.username);
  }

  private onUseremailWasChanged(event: UseremailWasChanged) {
    this._useremail = Username.fromString(event.useremail);
  }alias
}
