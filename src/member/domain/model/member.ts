import { AggregateRoot } from '../../../core/domain/models/aggregate-root';
import { MemberWasCreated } from '../event/member-was-created.event';
import { MemberId } from './member-id';
import { MemberName } from './member-name';
import { GroupId } from '../../../group/domain/model/group-id';
import { UserId } from '../../../user/domain/model/user-id';
import { MemberWasRegisteredAsUser } from '../event/member-was-registered-as-user.event';
import { MemberNameWasChanged } from '../event';
import { MemberWasRemoved } from '../event/member-was-removed.event';

export class Member extends AggregateRoot {
  private _memberId: MemberId;
  private _groupId: GroupId;
  private _membername: MemberName;
  private _userId: UserId;
  private _isRemoved: boolean;

  private constructor() {
    super();
  }

  public static add(
    memberId: MemberId,
    groupId: GroupId,
    name: MemberName,
    userId = UserId.fromString(''),
  ): Member {
    const member = new Member();

    member.apply(
      new MemberWasCreated(
        memberId.value,
        groupId.value,
        name.value,
        userId.value,
      ),
    );

    return member;
  }

  aggregateId(): string {
    return this._memberId.value;
  }

  get id(): MemberId {
    return this._memberId;
  }

  get groupId(): GroupId {
    return this._groupId;
  }

  get name(): MemberName {
    return this._membername;
  }

  get userId(): UserId {
    return this._userId;
  }

  get isRemoved(): boolean {
    return this._isRemoved;
  }

  setUserId(userId: UserId) {
    if (userId.equals(this._userId)) {
      return;
    }

    this.apply(
      new MemberWasRegisteredAsUser(this._memberId.value, userId.value),
    );
  }

  rename(name: MemberName) {
    if (name.equals(this._membername)) {
      return;
    }

    this.apply(new MemberNameWasChanged(this._memberId.value, name.value));
  }

  remove() {
    if (this._isRemoved) {
      return;
    }

    this.apply(new MemberWasRemoved(this._memberId.value));
  }

  private onMemberWasCreated(event: MemberWasCreated) {
    this._memberId = MemberId.fromString(event.id);
    this._groupId = GroupId.fromString(event.idGroup);
    this._membername = MemberName.fromString(event.membername);
    this._userId = UserId.fromString(event.idUser);
    this._isRemoved = false;
  }

  private onMemberWasRegisteredAsUser(event: MemberWasRegisteredAsUser) {
    this._userId = UserId.fromString(event.idUser);
  }

  private onMemberNameWasChanged(event: MemberNameWasChanged) {
    this._membername = MemberName.fromString(event.name);
  }

  private onMemberWasRemoved(event: MemberWasRemoved) {
    this._isRemoved = true;
  }
}
