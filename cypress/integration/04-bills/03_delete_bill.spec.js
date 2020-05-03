import * as uuid from 'uuid';

import { post, remove, newBill, newGroup } from '../../api';

describe('DELETE /bills/:id', () => {
  let userId;
  let groupId;
  let billId;

  const payers = [
    {
      id: '5bfa9f62-697f-46ff-9a7e-a149bfe6be02',
      money: 100,
    },
    {
      id: '2d811427-ff8e-4886-89b9-240ae6024549',
      money: 200,
    },
  ];

  const debtors = [
    {
      id: '5bfa9f62-697f-46ff-9a7e-a149bfe6be02',
      money: 10,
    },
    {
      id: 'b6672012-4ca5-4aff-b346-b1e43ebdfa91',
      money: 20,
    },
  ];

  beforeEach(() => {
    cy.task('db:clean');

    groupId = uuid.v4();
    userId = uuid.v4();
    billId = uuid.v4();

    cy.fixture('groups.json').then(groups => {
      cy.fixture('bills.json').then(bills => {
      const group = newGroup(groups.body, groupId, userId);

      post('groups', group, userId, true);

      cy.task('sync');

      const bill = newBill(
        bills.body,
        billId,
        groupId,
        payers,
        debtors,
        userId,
      );

      post('bills', bill, userId);

      cy.task('sync');
      });
    });
  });

  it('Validate the status code', function() {
    remove('bills', billId, userId)
      .its('status')
      .should('equal', 204);
  });

  it('Validate that cannot delete removed bill', function() {
    remove('bills', billId, userId)
      .its('status')
      .should('equal', 204);

    cy.task('sync');

    remove('bills', billId, userId)
      .its('status')
      .should('equal', 404);
  });

  it('Validate that cannot delete unknown bill', function() {
    const anotherBillId = uuid.v4();

    remove('bills', anotherBillId, userId)
      .its('status')
      .should('equal', 404);
  });
});
