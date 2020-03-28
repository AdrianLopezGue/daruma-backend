import { Inject, Injectable } from '@nestjs/common';

import { GroupName, GroupId } from '../../domain/model';
import { CheckUniqueGroupName } from '../../domain/services/check-unique-group-name.service';

@Injectable()
export class CheckUniqueGroupNameFromFirebase implements CheckUniqueGroupName {
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
