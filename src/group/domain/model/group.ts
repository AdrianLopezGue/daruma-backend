import { AggregateRoot } from '../../../core/domain/models/aggregate-root';
import { GroupWasCreated, GroupNameWasChanged } from '../event';
import { GroupId } from './group-id';
import { GroupName } from './group-name';
import { GroupCurrencyCode } from './group-currency-code';
import { UserId } from '../../../user/domain/model';

export class Group extends AggregateRoot {
  private _groupId: GroupId;
  private _name: GroupName;
  private _currencyCode: GroupCurrencyCode;
  private _idOwner: UserId;

  private constructor() {
    super();
  }

  public static add(
    scopeId: GroupId,
    name: GroupName,
    currencyCode: GroupCurrencyCode,
    idOwner: UserId
  ): Group {
    const group = new Group();

    group.apply(new GroupWasCreated(scopeId.value, name.value, currencyCode.value, idOwner.value));

    return group;
  }

  public aggregateId(): string {
    return this._groupId.value;
  }

  get id(): GroupId {
    return this._groupId;
  }

  get name(): GroupName {
    return this._name;
  }

  get currencyCode(): GroupCurrencyCode {
    return this._currencyCode;
  }

  get idOwner(): UserId {
    return this._idOwner;
  }

  rename(name: GroupName) {
    if (name.equals(this._name)) {
      return;
    }

    this.apply(new GroupNameWasChanged(this._groupId.value, name.value));
  }

  private onGroupWasCreated(event: GroupWasCreated) {
    this._groupId = GroupId.fromString(event.id);
    this._name = GroupName.fromString(event.groupname);
    this._currencyCode = GroupCurrencyCode.fromString(event.groupcurrencycode);
    this._idOwner = UserId.fromString(event.userid);
  }

  private onGroupNameWasChanged(event: GroupNameWasChanged) {
    this._name = GroupName.fromString(event.name);
  }
}