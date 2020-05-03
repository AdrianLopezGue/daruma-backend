import * as uuid from 'uuid';

import { newGroup, post } from '../../api';

describe('POST /groups', () => {
  let ownerId;
  let groupId;

  beforeEach(() => {
    cy.task('db:clean');

    ownerId = uuid.v4();
    groupId = uuid.v4();
  });

  it('Creates a group', () => {
    cy.fixture('groups.json').then(groups => {
      const group = newGroup(groups.body, groupId, ownerId);

      post('groups', group, ownerId)
        .its('status')
        .should('equal', 204);
    });
  });

  it('Checks logged user is the group owner', () => {
    cy.fixture('groups.json').then(groups => {
      const otherUserId = uuid.v4();
      const group = newGroup(groups.body, groupId, ownerId);

      post('groups', group, otherUserId)
        .its('status')
        .should('equal', 403);
    });
  });
});
