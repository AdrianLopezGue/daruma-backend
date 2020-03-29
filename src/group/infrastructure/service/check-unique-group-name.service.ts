import { Inject, Injectable } from '@nestjs/common';

import { GroupName, GroupId } from '../../domain/model';
import { CheckUniqueGroupName } from '../../domain/services/check-unique-group-name.service';
import { GROUPS } from '@app/group/domain/repository';
import { GroupDatabase } from '../database';
import { UserId } from '@app/user/domain/model';

@Injectable()
export class CheckUniqueGroupNameFromFirebase implements CheckUniqueGroupName {
  constructor(
    @Inject(GROUPS) private readonly firebaseDatabase: GroupDatabase,
  ) {}

  async with(groupName: GroupName, userId: UserId): Promise<GroupId> {
    const groupView = await this.firebaseDatabase.findGroupByName(groupName, userId);

    if (groupView === null) {
      return null;
    }

    return GroupId.fromString(groupView.idOwner.value);
  }
}
