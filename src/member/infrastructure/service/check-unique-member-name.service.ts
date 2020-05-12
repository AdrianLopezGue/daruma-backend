import { Inject, Injectable } from '@nestjs/common';

import { CheckUniqueMemberName } from '../../domain/services/check-unique-member-name.service';
import { Model } from 'mongoose';
import { MEMBER_MODEL, MemberView } from '../read-model/schema/member.schema';
import { MemberName } from '../../domain/model/member-name';
import { GroupId } from '../../../group/domain/model/group-id';
import { MemberId } from '../../domain/model/member-id';

@Injectable()
export class CheckUniqueMemberNameFromReadModel
  implements CheckUniqueMemberName {
  constructor(
    @Inject(MEMBER_MODEL) private readonly memberModel: Model<MemberView>,
  ) {}

  async with(name: MemberName, groupId: GroupId): Promise<MemberId> {
    const memberView = await this.memberModel
      .findOne({ $and: [{ name: name.value }, { groupId: groupId.value }] })
      .exec();
    if (memberView === null) {
      return null;
    }

    return MemberId.fromString(memberView.id);
  }
}
