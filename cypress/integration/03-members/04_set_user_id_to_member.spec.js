import * as uuid from 'uuid';

import { post, patch, newGroup, newMember, newUserId } from '../../api';

describe('PATCH /members/:id', () => {
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

  it('Set userId to member', function() {
    cy.fixture('members.json').then(members => {
      members.bodyNewUserId.userId = userId;
      patch('members', memberId, members.bodyNewUserId, userId)
        .its('status')
        .should('equal', 204);
    });    
  });

  it('Cannot set userId to unknown member', function() {
    cy.fixture('members.json').then(members => {
      const anotherMemberId = uuid.v4();

      members.bodyNewUserId.userId = userId;
      patch('members', anotherMemberId, members.bodyNewUserId, userId)
        .its('status')
        .should('equal', 404);
    }); 
  });
});
