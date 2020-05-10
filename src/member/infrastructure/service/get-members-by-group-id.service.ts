import { Inject, Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { MEMBER_MODEL, MemberView } from '../read-model/schema/member.schema';
import { GroupId } from '../../../group/domain/model/group-id';
import { GetMembersIdByGroupId } from '../../domain/services/get-members-by-group-id.service';

@Injectable()
export class GetMembersIdByGroupIdFromReadModel implements GetMembersIdByGroupId {
  constructor(
    @Inject(MEMBER_MODEL) private readonly memberModel: Model<MemberView>,
  ) {}

  async with(groupId: GroupId): Promise<string[]> {
    return this.memberModel.distinct('_id', { groupId: groupId.value }).exec();
  }
}