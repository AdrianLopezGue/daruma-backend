import { Inject, Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { MEMBER_MODEL, MemberView } from '../read-model/schema/member.schema';
import { MemberId } from '../../domain/model/member-id';
import { GroupId } from '../../../group/domain/model/group-id';
import { UserId } from '../../../user/domain/model/user-id';
import { CheckUserInGroup } from '../../domain/services/check-user-in-group.service';

@Injectable()
export class CheckUserInGroupFromReadModel implements CheckUserInGroup {
  constructor(
    @Inject(MEMBER_MODEL) private readonly memberModel: Model<MemberView>,
  ) {}

  async with(userId: UserId, groupId: GroupId): Promise<MemberId> {
    const memberView = await this.memberModel
      .findOne({ $and: [{ groupId: groupId.value }, { userId: userId.value }] })
      .exec();

    if (memberView === null) {
      return null;
    }

    return MemberId.fromString(memberView.id);
  }
}
