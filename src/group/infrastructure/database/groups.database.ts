import { Injectable } from '@nestjs/common';

import { GroupId } from '../../domain/model/group-id';
import { UserId } from '../../../user/domain/model/user-id';
import { Groups } from '../../domain/repository/groups';
import { Group } from '../../domain/model/group';
import { FirestoreDatabase } from '../../../core/database/database';
import { GroupView } from '../schema/group.view';
import { GroupName } from '../../domain/model/group-name';

@Injectable()
export class GroupDatabase implements Groups {
  constructor(
    private readonly firestoreDatabase: FirestoreDatabase,
  ){}

  save(group: Group): void {

    const data = {
      name: group.name,
      currencyCode: group.currencyCode,
      idOwner: group.idOwner
    }
    this.firestoreDatabase
      .getCollection('groups')
      .doc(group.id.value)
      .set(data);
  }

  async get(groupId: GroupId): Promise<GroupView> {
    return this.firestoreDatabase
      .getDocument('groups', groupId.value)
  }

  async find(groupId: GroupId): Promise<GroupView> | null {
    return this.firestoreDatabase
      .getDocument('groups', groupId.value)
  }

  async findName(groupName: GroupName, idOwner: UserId): Promise<GroupView> | null {
    return this.firestoreDatabase
    .getCollection('groups')
    .where('idOwner', '==', idOwner.value)
    .where('name', '==', groupName.value)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return null;
      }

      let group: GroupView = null;

      snapshot.forEach(doc => {
        group = this.mapResponse(doc.data(), doc.id);
      });

      return group;
    })
    .catch(err => {
      console.log('Error getting documents', err);

      return null;
    });
  }

  getGroupsById(userId: UserId): Promise<GroupView[]> {
    return this.firestoreDatabase
      .getCollection('groups')
      .where('idOwner', '==', userId.value)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return [];
        }

        const group: GroupView[] = [];

        snapshot.forEach(doc => {
          group.push(this.mapResponse(doc.data(), doc.id));
        });

        return group;
      })
      .catch(err => {
        console.log('Error getting documents', err);

        return [];
      });
  }

  private mapResponse(data: any, id: string): GroupView{
    return {
      idGroup: id,
      name: data.name,
      currencyCode: data.currencyCode,
      idOwner: data.idOwner
    }
  }
}
