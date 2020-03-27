import { Injectable } from '@nestjs/common';

import firebaseDatabase from './database';

import { GroupId } from '../../domain/model/group-id';
import { UserId } from '../../../user/domain/model/user-id';
import { Groups } from '../../domain/repository/groups';
import { Group } from '../../domain/model/group';
import { GroupName } from '../../domain/model/group-name';
import { GroupCurrencyCode } from '@app/group/domain/model';

@Injectable()
export class GroupDatabase implements Groups {
  save(group: Group): Promise<Group> {
    return firebaseDatabase
      .collection('groups')
      .add(group)
      .then(groupsRef => {
        return {
          ...group,
          id: groupsRef.id,
        };
      })
      .catch(error => {
        console.log('database error');
        return null;
      });
  }

  get(groupId: GroupId): Promise<Group> {
    return firebaseDatabase
      .collection('groups')
      .doc(groupId.value)
      .get()
      .then(doc => this.mapResponse(doc.data(), GroupId.fromString(doc.id)))
      .catch(error => {
        console.log('database error');
        return null;
      });
  }

  async find(groupId: GroupId): Promise<Group> | null {
    return firebaseDatabase
      .collection('groups')
      .doc(groupId.value)
      .get()
      .then((doc) =>
        {this.mapResponse(doc.data(), GroupId.fromString(doc.id));}
        // tslint:disable-next-line: max-line-length
      )
      .catch(error => {
        console.log('database error');
        return null;
      });
  }

  private mapResponse(data: any, id: GroupId): void {

    Group.add(GroupId.fromString(id), GroupName.fromString(data.name), GroupCurrencyCode.fromString(data.currencyCode), UserId.fromString(data.idOwner));
  }
}
