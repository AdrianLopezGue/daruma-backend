import { Inject, Injectable } from '@nestjs/common';

import { GroupId } from '../../domain/model';
import { CheckUniqueGroupName } from '../../domain/services/check-unique-group-name.service';
import { GroupView, GROUP_MODEL } from '../read-model/schema/group.schema';
import { Model } from 'mongoose';
import { GroupName } from '../../domain/model/group-name';

@Injectable()
export class CheckUniqueGroupNameFromReadModel implements CheckUniqueGroupName {
  constructor(
    @Inject(GROUP_MODEL) private readonly groupModel: Model<GroupView>,
  ) {}

  async with(name: GroupName): Promise<GroupId> {
    const groupView = await this.groupModel.findOne({ name: name.value });

    if (groupView === null) {
      return null;
    }

    return GroupId.fromString(groupView.id);
  }
}