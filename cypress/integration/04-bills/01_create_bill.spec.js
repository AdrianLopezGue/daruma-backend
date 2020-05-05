import * as uuid from 'uuid';

import { post, newBill, newUser, newGroup } from '../../api';

describe('POST /bills', () => {
  let groupId;
  let userId;
  let billId;

  const payers = [
    {
      _id: '7150c2b3-239e-41c3-9264-37396057c756',
      money: 100,
    },
    {
      _id: '2d811427-ff8e-4886-89b9-240ae6024549',
      money: 200,
    },
  ];

  const debtors = [
    {
      _id: '7150c2b3-239e-41c3-9264-37396057c756',
      money: 10,
    },
    {
      _id: 'b6672012-4ca5-4aff-b346-b1e43ebdfa91',
      money: 20,
    },
  ];

  beforeEach(() => {
    cy.task('db:clean');

    groupId = uuid.v4();
    userId = uuid.v4();
    billId = uuid.v4();

    cy.fixture('groups.json').then(groups => {
      const group = newGroup(groups.body, groupId, userId);

      post('groups', group, userId, true);

      cy.task('sync');
    });
  });

  it('Validate the status code', function() {
    cy.fixture('bills.json').then(bills => {
      const bill = newBill(
        bills.body,
        billId,
        groupId,
        payers,
        debtors,
        userId,
      );

      post('bills', bill, userId)
        .its('status')
        .should('equal', 204);
    });
  });

  it('Validate the creator is an authenticated user', function() {
    cy.fixture('bills.json').then(bills => {
      const otherUser = uuid.v4();
      const bill = newBill(
        bills.body,
        billId,
        groupId,
        payers,
        debtors,
        otherUser,
      );

      post('bills', bill, userId)
        .its('status')
        .should('equal', 403);
    });
  });

  it('Validate the creator is a member of the group', function() {
    cy.fixture('bills.json').then(bills => {
      cy.fixture('users.json').then(users => {
        const otherUserId = uuid.v4();
        const bill = newBill(
          bills.body,
          billId,
          groupId,
          payers,
          debtors,
          otherUserId,
        );
        
        const user = newUser(users.body, otherUserId);

        post('users', user, otherUserId);

        cy.task('sync');

        post('bills', bill, otherUserId)
          .its('status')
          .should('equal', 404);
      });
    });
  });
});
