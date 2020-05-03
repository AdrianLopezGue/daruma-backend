import * as uuid from 'uuid';

import { newGroup, post, remove } from '../../api';

describe('DELETE /groups/:id', () => {
  let ownerId;
  let groupId;

  beforeEach(() => {
    cy.task('db:clean');

    ownerId = uuid.v4();
    groupId = uuid.v4();

    cy.fixture('groups.json').then(groups => {
      const group = newGroup(...groups.body, groupId, ownerId);

      post('groups', group, ownerId, true);

      cy.task('sync');
    });
  });

  it('User can remove his groups', () => {
    cy.fixture('groups.json').then(groups => {
      remove('groups', groupId, ownerId)
        .its('status')
        .should('equal', 204);
    });
  });
});
