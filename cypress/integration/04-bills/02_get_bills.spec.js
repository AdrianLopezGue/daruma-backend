import * as uuid from 'uuid';

import { post, get, newBill, newGroup } from '../../api';

describe('GET /bills/:id', () => {
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
      });
    });
  });

  it('Validate the status code', function() {
    get('bills', groupId, userId)
      .its('status')
      .should('equal', 200);
  });

  it('Validate that cannot access to bills of unknown group', function() {
    const otherGroupId = uuid.v4();

    get('bills', otherGroupId, userId)
      .its('status')
      .should('equal', 404);      
  });
});
