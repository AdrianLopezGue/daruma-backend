import { AggregateRoot } from '../../../core/domain/models/aggregate-root';
import { GroupWasCreated, GroupNameWasChanged } from '../event';
import { GroupId } from './group-id';
import { GroupName } from './group-name';
import { GroupCurrencyCode } from './group-currency-code';
import { UserId } from '../../../user/domain/model';
import { MemberId } from '../../../member/domain/model/member-id';
import { MemberName } from '../../../member/domain/model/member-name';
import { Member } from '../../../member/domain/model/member';
import { GroupWasRemoved } from '../event/group-was-removed.event';

export class Group extends AggregateRoot {
  private _groupId: GroupId;
  private _name: GroupName;
  private _currencyCode: GroupCurrencyCode;
  private _ownerId: UserId;
  private _isRemoved: boolean;

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

  public addMember(
    memberId: MemberId,
    name: MemberName,
    userId = UserId.fromString(''),
  ): Member {
    return Member.add(memberId, this.id, name, userId);
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

  get isRemoved(): boolean {
    return this._isRemoved;
  }

  rename(name: GroupName) {
    if (name.equals(this._name)) {
      return;
    }

    this.apply(new GroupNameWasChanged(this._groupId.value, name.value));
  }

  remove() {
    if (this._isRemoved) {
      return;
    }

    this.apply(new GroupWasRemoved(this._groupId.value));
  }

  private onGroupWasCreated(event: GroupWasCreated) {
    this._groupId = GroupId.fromString(event.id);
    this._name = GroupName.fromString(event.name);
    this._currencyCode = GroupCurrencyCode.fromString(event.currencyCode);
    this._ownerId = UserId.fromString(event.ownerId);
    this._isRemoved = false;
  }

  private onGroupNameWasChanged(event: GroupNameWasChanged) {
    this._name = GroupName.fromString(event.name);
  }

  private onGroupWasRemoved(event: GroupWasRemoved) {
    this._isRemoved = true;
  }
}
