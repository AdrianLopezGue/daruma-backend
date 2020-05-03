import * as uuid from 'uuid';

import { get, newGroup, post } from '../../api';

describe('GET /groups/:id', () => {
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

  it('User can access his groups', () => {
    cy.fixture('groups.json').then(groups => {
      const response = { ...groups.response, _id: groupId, ownerId };

      get('groups', groupId, ownerId)
        .its('body')
        .should('deep.equal', response);
    });
  });

  it('User cannot access to unknown group', () => {
    const otherGroupId = uuid.v4();

    get('groups', otherGroupId, ownerId)
      .its('body')
      .should('have.length', 0);
  });

  xit('Use cannot access to groups he does not own', () => {
    const otherUser = uuid.v4();

    get('groups', groupId, otherUser)
      .its('status')
      .should('equals', 403);
  });
});
