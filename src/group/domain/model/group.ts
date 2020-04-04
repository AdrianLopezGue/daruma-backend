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
  private _ownerId: UserId;

  private constructor() {
    super();
  }

  public static add(
    groupId: GroupId,
    name: GroupName,
    currencyCode: GroupCurrencyCode,
    ownerId: UserId,
  ): Group {
    const group = new Group();

    group.apply(
      new GroupWasCreated(
        groupId.value,
        name.value,
        currencyCode.value,
        ownerId.value,
      ),
    );

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

  get ownerId(): UserId {
    return this._ownerId;
  }

  rename(name: GroupName) {
    if (name.equals(this._name)) {
      return;
    }

    this.apply(new GroupNameWasChanged(this._groupId.value, name.value));
  }

  private onGroupWasCreated(event: GroupWasCreated) {
    this._groupId = GroupId.fromString(event.id);
    this._name = GroupName.fromString(event.name);
    this._currencyCode = GroupCurrencyCode.fromString(event.currencyCode);
    this._ownerId = UserId.fromString(event.ownerId);
  }

  private onGroupNameWasChanged(event: GroupNameWasChanged) {
    this._name = GroupName.fromString(event.name);
  }
}
