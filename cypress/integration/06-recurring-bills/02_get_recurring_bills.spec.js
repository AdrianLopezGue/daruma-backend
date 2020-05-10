import * as uuid from 'uuid';

import { get, post, newGroup, newRecurringBill } from '../../api';

describe('GET /recurringbills', () => {
  let recurringBillId;
  let billId;
  let groupId;
  let userId;

  beforeEach(() => {
    cy.task('db:clean');

    recurringBillId = uuid.v4();
    billId = uuid.v4();
    groupId = uuid.v4();
    userId = uuid.v4();

    cy.fixture('groups.json').then(groups => {
      cy.fixture('recurring-bills.json').then(recurringBills => {
        const group = newGroup(groups.body, groupId, userId);

        post('groups', group, userId, true);
  
        cy.task('sync');

        const recurringBill = newRecurringBill(
          recurringBills.body,
          recurringBillId,
          billId,
          groupId,
        );

        post('recurringbills', recurringBill, userId);

        cy.task('sync');
      });
    });
  });

  it('Get recurring bill', function() {
    cy.fixture('recurring-bills.json').then(recurringBills => {
      get('recurringbills', groupId, userId)
        .its('status')
        .should('equal', 200);
    });
  });
});
