import * as uuid from 'uuid';

import { get, newGroup, post, put } from '../../api';

describe('PUT /groups/:id', () => {
  let ownerId;
  let groupId;

  beforeEach(() => {
    cy.task('db:clean');

    ownerId = uuid.v4();
    groupId = uuid.v4();

    cy.fixture('groups.json').then(groups => {
      const group = newGroup(groups.body, groupId, ownerId);

      post('groups', group, ownerId, true);

      cy.task('sync');
    });
  });

  it('Change group name by owner', () => {
    cy.fixture('groups.json').then(groups => {
      const name = 'New Group name';
      const response = { ...groups.response, _id: groupId, ownerId, name };

      put('groups', groupId, { name }, ownerId).then(() => {
        cy.task('sync');

        get('groups', groupId, ownerId)
          .its('body')
          .should('deep.equal', response);
      });
    });
  });

  xit('Change group name by other user', () => {
    cy.fixture('groups.json').then(groups => {
      const name = 'Fail Group name';
      const otherUserId = uuid.v4();

      put('groups', groupId, { name }, otherUserId).then(() => {
        cy.task('sync');

        get('groups', groupId, ownerId)
          .its('status')
          .should('equal', 403);
      });
    });
  });
});
