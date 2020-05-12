import * as uuid from 'uuid';

import { post, newGroup, newMember, newTransaction } from '../../api';

describe('POST /transactions', () => {
  let groupId;
  let userId;
  let senderId;
  let beneficiaryId;
  let transactionId;

  beforeEach(() => {
    cy.task('db:clean');

    groupId = uuid.v4();
    userId = uuid.v4();
    senderId = uuid.v4();
    beneficiaryId = uuid.v4();
    transactionId = uuid.v4();

    cy.fixture('groups.json').then(groups => {
      cy.fixture('members.json').then(members => {
        const group = newGroup(groups.body, groupId, userId);
        post('groups', group, userId, true);

        cy.task('sync');

        const member = newMember(...members.tommytoe, senderId, groupId);
        const member2 = newMember(...members.mikemoe, beneficiaryId, groupId);
        post('members', member, userId);

        cy.task('sync');

        post('members', member2, userId);

        cy.task('sync');
      });
    });
  });

  it('Creates a transfer transaction', function() {
    cy.fixture('transactions.json').then(transactions => {
      const transaction = newTransaction(
        ...transactions.body,
        transactionId,
        senderId,
        beneficiaryId,
        groupId,
      );

      post('transactions', transaction, userId)
        .its('status')
        .should('equal', 204);
    });
  });

  it('Validate sender must be a group member', function() {
    cy.fixture('transactions.json').then(transactions => {
      const otherSenderId = uuid.v4();
      const transaction = newTransaction(
        ...transactions.body,
        transactionId,
        otherSenderId,
        beneficiaryId,
        groupId,
      );

      post('transactions', transaction, userId)
        .its('status')
        .should('equal', 404);
    });
  });

  it('Validate beneficiary must be a group member', function() {
    cy.fixture('transactions.json').then(transactions => {
      const otherBeneficaryId = uuid.v4();
      const transaction = newTransaction(
        ...transactions.body,
        transactionId,
        senderId,
        otherBeneficaryId,
        groupId,
      );

      post('transactions', transaction, userId)
        .its('status')
        .should('equal', 404);
    });
  });

  it('Validate cannot create transfer transaction to unknown group', function() {
    cy.fixture('transactions.json').then(transactions => {
      const otherGroupId = uuid.v4();

      const transaction = newTransaction(
        ...transactions.body,
        transactionId,
        senderId,
        beneficiaryId,
        otherGroupId,
      );

      post('transactions', transaction, userId)
        .its('status')
        .should('equal', 404);
    });
  });
});
