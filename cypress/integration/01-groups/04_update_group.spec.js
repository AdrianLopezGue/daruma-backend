import * as uuid from 'uuid';

import { get, newGroup, post, patch } from '../../api';

describe('PATCH NAME /groups/:id', () => {
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
      const newName = 'New Group name';
      groups.bodyGroupUpdated.name = newName;
      groups.bodyGroupUpdated.currencyCode = groups.example.currencyCode;

      const response = { ...groups.response, _id: groupId, ownerId: ownerId, name: newName };

      patch('groups', groupId, groups.bodyGroupUpdated, ownerId).then(() => {
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

      patch('groups', groupId, { name }, otherUserId).then(() => {
        cy.task('sync');

        get('groups', groupId, ownerId)
          .its('status')
          .should('equal', 403);
      });
    });
  });

  it('Change group currency code by owner', () => {
    cy.fixture('groups.json').then(groups => {
      const newCurrencyCode = 'USD';
      groups.bodyGroupUpdated.currencyCode = newCurrencyCode;
      groups.bodyGroupUpdated.name = groups.example.name;

      const response = { ...groups.response, _id: groupId, ownerId: ownerId, currencyCode: newCurrencyCode };

      patch('groups', groupId, groups.bodyGroupUpdated, ownerId).then(() => {
        cy.task('sync');

        get('groups', groupId, ownerId)
          .its('body')
          .should('deep.equal', response);
        });
      });
    });

  xit('Change group currency code by other user', () => {
    cy.fixture('groups.json').then(groups => {
      const name = 'Fail Group name';
      const otherUserId = uuid.v4();

      patch('groups', groupId, { name }, otherUserId).then(() => {
        cy.task('sync');

        get('groups', groupId, ownerId)
          .its('status')
          .should('equal', 403);
      });
    });
  });
});
