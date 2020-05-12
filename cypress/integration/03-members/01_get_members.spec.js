import * as uuid from 'uuid';

import { get, post, newGroup } from '../../api';

describe('GET /members', () => {
  let userId;
  let memberId;
  let groupId;

  beforeEach(() => {
    cy.task('db:clean');

    userId = uuid.v4();
    memberId = uuid.v4();
    groupId = uuid.v4();

    cy.fixture('groups.json').then(groups => {
      const group = newGroup(groups.body, groupId, userId);

      post('groups', group, userId, true);

      cy.task('sync');
    });
  });

  it('Validate the status code', function() {
    cy.fixture('users.json').then(users => {
      users.johndoe.id = userId;

      get('members', groupId, users.johndoe.id)
        .its('status')
        .should('equal', 200);
    });
  });

  it('Validate that cannot access to unknown group', function() {
    cy.fixture('users.json').then(users => {
      const otherGroup = uuid.v4();
      users.johndoe.id = userId;

      get('members', otherGroup, users.johndoe.id)
        .its('status')
        .should('equal', 404);
    });
  });
});
