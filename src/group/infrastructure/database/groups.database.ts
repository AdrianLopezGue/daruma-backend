import { Injectable } from '@nestjs/common';

import firebaseAdmin from './database';

import { GroupId } from '../../domain/model/group-id';
import { UserId } from '../../../user/domain/model/user-id';
import { Groups } from '../../domain/repository/groups';
import { Group } from '../../domain/model/group';
import { GroupName } from '../../domain/model/group-name';
import { GroupCurrencyCode } from '@app/group/domain/model';

@Injectable()
export class GroupDatabase implements Groups {
  save(group: Group): Promise<Group> {
    return firebaseAdmin
      .collection('groups')
      .add(group)
      .then(groupsRef => {
        return {
          ...group,
          id: groupsRef.id,
        };
      })
      .catch(error => {
        return null;
      });
  }

  get(groupId: GroupId): Promise<Group> {
    return firebaseAdmin
      .collection('groups')
      .doc(groupId.value)
      .get()
      .then(doc => this.mapResponse(doc.data(), doc.id))
      .catch(error => {
        return null;
      });
  }

  async find(groupId: GroupId): Promise<Group> | null {
    return firebaseAdmin
      .collection('groups')
      .doc(groupId.value)
      .get()
      .then((doc) =>
        {this.mapResponse(doc.data(), doc.id);}
        // tslint:disable-next-line: max-line-length
      )
      .catch(error => {
        return null;
      });
  }

  private mapResponse(data: any, id: string): void {

    // tslint:disable-next-line: max-line-length
    Group.add(GroupId.fromString(id), GroupName.fromString(data.name), GroupCurrencyCode.fromString(data.currencyCode), UserId.fromString(data.idOwner));
  }
}
