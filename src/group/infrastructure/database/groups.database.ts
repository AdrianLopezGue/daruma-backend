import { Injectable } from '@nestjs/common';

import firebaseDatabase from './database';

import { GroupId } from '../../domain/model/group-id';
import { Groups } from '../../domain/repository/groups';
import { Group } from '../../domain/model/group';

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
      .then(doc => this.mapResponse(doc.data(), doc.id))
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
      .then(doc => this.mapResponse(doc.data(), doc.id))
      .catch(error => {
        console.log('database error');
        return null;
      });
  }

  private mapResponse(data: any, id: string): Group {
    return {
        id: id,
        name: data.name,
        currencyCode: data.currencyCode,
        idOwner: data.idOwner
    };
}
}
