import * as uuid from 'uuid';

import { post, remove, newGroup, newMember } from '../../api';

describe('DELETE /members', () => {
  let userId;
  let groupId;
  let memberId;

  beforeEach(() => {
    cy.task('db:clean');

    userId = uuid.v4();
    memberId = uuid.v4();
    groupId = uuid.v4();

    cy.fixture('groups.json').then(groups => {
      cy.fixture('members.json').then(members => {
        const group = newGroup(groups.body, groupId, userId);

        post('groups', group, userId, true);

        cy.task('sync');

        const member = newMember(...members.body, memberId, groupId);

        post('members', member, userId)

        cy.task('sync');
      });
    });
  });

  it('Delete member', function() {
    remove('members', memberId, userId)
      .its('status')
      .should('equal', 204);
  });

  it('Check that requester cannot be deleted', function() {
    remove('members', userId, userId)
      .its('status')
      .should('equal', 403);
  });

  it('Check that cannot delete unknown member', function() {
    const anotherUserId = uuid.v4();

    remove('members', userId, anotherUserId)
      .its('status')
      .should('equal', 404);
  });
});
