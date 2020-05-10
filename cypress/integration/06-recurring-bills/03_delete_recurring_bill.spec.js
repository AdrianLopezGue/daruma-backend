import * as uuid from 'uuid';

import { post, remove, remove, newGroup, newRecurringBill } from '../../api';

describe('DELETE /recurringbill/:id', () => {
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

  it('Delete recurring bill', function() {
    remove('recurringbills', recurringBillId, userId)
      .its('status')
      .should('equal', 204);
  });

  it('Check that cannot delete unknown member', function() {
    const anotherRecurringBillId = uuid.v4();

    remove('recurringbill', anotherRecurringBillId, userId)
      .its('status')
      .should('equal', 404);
  });
});