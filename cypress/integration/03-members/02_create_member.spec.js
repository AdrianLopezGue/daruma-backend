import * as uuid from 'uuid';

import { post, newGroup, newMember } from '../../api';

describe('POST /members', () => {
  let groupId;
  let userId;
  let memberId;

  beforeEach(() => {
    cy.task('db:clean');

    groupId = uuid.v4();
    userId = uuid.v4();
    memberId = uuid.v4();

    cy.fixture('groups.json').then(groups => {
      const group = newGroup(groups.body, groupId, userId);

      post('groups', group, userId, true);

      cy.task('sync');
    });
  });

  it('Creates a member', function() {
    cy.fixture('members.json').then(members => {
      const member = newMember(...members.body, memberId, groupId);

      post('members', member, userId)
        .its('status')
        .should('equal', 204);
    });
  });

  it('Cannot add new member to unknown group', function() {
    cy.fixture('members.json').then(members => {
      const anotherGroupId = uuid.v4();
      const member = newMember(...members.body, memberId, anotherGroupId);

      post('members', member, userId)
        .its('status')
        .should('equal', 404);
    });
  });

  it('Check if member with exact name is already in group', function() {
    cy.fixture('members.json').then(members => {
      members.body.name = "John Doe";
      const member = newMember(...members.body, memberId, groupId);

      post('members', member, userId)
        .its('status')
        .should('equal', 409);
    });
  });
});
