import { AggregateRoot } from '../../../core/domain/models/aggregate-root';
import { MemberWasRegistered } from '../event/member-was-created.event';
import { MemberId } from './member-id';
import { MemberEmail } from './member-email';
import { MemberName } from './member-name';
import { GroupId } from '../../../group/domain/model/group-id';
import { UserId } from '../../../user/domain/model/user-id';

export class Member extends AggregateRoot {
  private _memberId: MemberId;
  private _groupId: GroupId;
  private _membername: MemberName;
  private _memberemail: MemberEmail;
  private _userId: UserId;

  private constructor() {
    super();
  }

  public static add(
    memberId: MemberId,
    groupId: GroupId,
    name: MemberName,
    email: MemberEmail,
    userId = UserId.fromString('')): Member {
    const member = new Member();

    member.apply(
      new MemberWasRegistered(
        memberId.value,
        groupId.value,
        name.value,
        email.value,
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

  get email(): MemberEmail {
    return this._memberemail;
  }

  get userId(): UserId {
    return this._userId;
  }

  private onMemberWasRegistered(event: MemberWasRegistered) {
    this._memberId = MemberId.fromString(event.id);
    this._groupId = GroupId.fromString(event.idGroup);
    this._membername = MemberName.fromString(event.membername);
    this._memberemail = MemberEmail.fromString(event.memberemail);
    this._userId = UserId.fromString(event.idUser);
  }
}
