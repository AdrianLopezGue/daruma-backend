import * as uuid from 'uuid';

describe('POST /transactions', () => {
  beforeEach(() => {
    cy.fixture('users.json').as('users');
    cy.fixture('groups.json').as('groups');
    cy.fixture('bills.json').as('bills');
    cy.fixture('transactions.json').as('transactions');
  });

  const post = (auth, sender, beneficiary, transaction) =>
    cy.request({
      method: 'POST',
      url: 'transactions',
      auth: { bearer: auth },
      body: {
        transactionId: transaction.id,
        senderId: sender.id,
        beneficiaryId: beneficiary.id,
        money: transaction.money,
        currencyCode: transaction.currencyCode,
      },
      failOnStatusCode: false,
    });

  it('Validate the status code', function() {
    post(
      this.users.johndoe.id,
      this.users.johndoe,
      this.users.tommytoe,
      this.transactions.example,
    )
      .its('status')
      .should('equal', 204);
  });
});
