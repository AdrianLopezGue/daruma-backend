import { AggregateRoot } from '../../../core/domain/models/aggregate-root';
import { MemberWasCreated } from '../event/member-was-created.event';
import { MemberId } from './member-id';
import { MemberName } from './member-name';
import { GroupId } from '../../../group/domain/model/group-id';
import { UserId } from '../../../user/domain/model/user-id';
import { MemberWasRegisteredAsUser } from '../event/member-was-registered-as-user.event';

export class Member extends AggregateRoot {
  private _memberId: MemberId;
  private _groupId: GroupId;
  private _membername: MemberName;
  private _userId: UserId;

  private constructor() {
    super();
  }

  public static add(
    memberId: MemberId,
    groupId: GroupId,
    name: MemberName,
    userId = UserId.fromString('')): Member {
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

  setUserId(userId: UserId) {
    if (userId.equals(this._userId)) {
      return;
    }

    this.apply(new MemberWasRegisteredAsUser(this._memberId.value, userId.value));
  }

  private onMemberWasCreated(event: MemberWasCreated) {
    this._memberId = MemberId.fromString(event.id);
    this._groupId = GroupId.fromString(event.idGroup);
    this._membername = MemberName.fromString(event.membername);
    this._userId = UserId.fromString(event.idUser);
  }

  private onMemberWasRegisteredAsUser(event: MemberWasRegisteredAsUser) {
    this._userId = UserId.fromString(event.idUser);
  }
}
