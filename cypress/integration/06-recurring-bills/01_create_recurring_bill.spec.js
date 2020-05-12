import * as uuid from 'uuid';

import { post, newRecurringBill } from '../../api';

describe('POST /recurringbill', () => {
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
    cy.task('sync');
  });

  it('Creates a recurring bill', function() {
    cy.fixture('recurring-bills.json').then(recurringBills => {
      const recurringBill = newRecurringBill(
        recurringBills.body,
        recurringBillId,
        billId,
        groupId,
      );

      post('recurringbills', recurringBill, userId)
        .its('status')
        .should('equal', 204);
    });
  });

  it('Validate cannot create existing bill', function() {
    cy.fixture('recurring-bills.json').then(recurringBills => {
      const recurringBill = newRecurringBill(
        recurringBills.body,
        recurringBillId,
        billId,
        groupId,
      );

      post('recurringbills', recurringBill, userId)
        .its('status')
        .should('equal', 204);

      post('recurringbills', recurringBill, userId)
        .its('status')
        .should('equal', 409);
    });
  });
});
