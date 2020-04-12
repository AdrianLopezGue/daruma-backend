import { Inject, Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { USER_MODEL, UserView } from '../read-model/schema/user.schema';
import { CheckUniqueUserEmail } from '../../domain/services/check-unique-user-email.service';
import { UserEmail } from '../../domain/model/user-email';
import { UserId } from '../../domain/model/user-id';

@Injectable()
export class CheckUniqueUserEmailFromReadModel implements CheckUniqueUserEmail {
  constructor(
    @Inject(USER_MODEL) private readonly userModel: Model<UserView>,
  ) {}

  async with(email: UserEmail): Promise<UserId> {
    const userView = await this.userModel.findOne({ email: email.value });

    if (userView === null) {
      return null;
    }

    return UserId.fromString(userView.id);
  }
}
