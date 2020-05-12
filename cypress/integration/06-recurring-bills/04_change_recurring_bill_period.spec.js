import * as uuid from 'uuid';

import { post, patch, newGroup, newRecurringBill } from '../../api';

describe('PATCH /recurringbills/:id', () => {
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

  it('Change period of recurring bill', function() {
    cy.fixture('recurring-bills.json').then(recurringBills => {
      recurringBills.bodyPeriodUpdated.period = 1;
      patch('recurringbills', recurringBillId, recurringBills.bodyPeriodUpdated, userId)
        .its('status')
        .should('equal', 204);
    });    
  });

  it('Cannot set userId to unknown member', function() {
    cy.fixture('recurring-bills.json').then(recurringBills => {
      const anotherRecurringBillId = uuid.v4();
      recurringBills.bodyPeriodUpdated.period = 1;

      patch('recurringbills', anotherRecurringBillId, recurringBills.bodyPeriodUpdated, userId)
        .its('status')
        .should('equal', 404);
    }); 
  });
});