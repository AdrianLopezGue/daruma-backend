import { Inject, Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { MEMBER_MODEL, MemberView } from '../read-model/schema/member.schema';
import { GetMembersIdByUserId } from '../../domain/services/get-members-by-user-id.service';
import { UserId } from '../../../user/domain/model/user-id';

@Injectable()
export class GetMembersIdByUserIdFromReadModel implements GetMembersIdByUserId {
  constructor(
    @Inject(MEMBER_MODEL) private readonly memberModel: Model<MemberView>,
  ) {}

  async with(userId: UserId): Promise<string[]> {
    return this.memberModel.distinct('_id', { userId: userId.value }).exec();
  }
}