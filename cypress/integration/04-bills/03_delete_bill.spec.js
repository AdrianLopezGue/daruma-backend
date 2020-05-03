import * as uuid from 'uuid';

describe('DELETE /bills', () => {
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
    cy.fixture('users.json').as('users');
    cy.fixture('groups.json').as('groups');
    cy.fixture('payers.json').as('payers');
    cy.fixture('debtors.json').as('debtors');
    cy.fixture('bills.json').as('bills');
  });

  const post = (auth, bill, owner, group, payers, debtors) =>
    cy.request({
      method: 'POST',
      url: 'bills',
      auth: { bearer: auth },
      body: {
        billId: bill.id,
        groupId: group.id,
        name: bill.name,
        date: bill.date,
        money: bill.money,
        currencyCode: bill.currencyCode,
        payers: payers,
        debtors: debtors,
        creatorId: owner.id,
      },
      failOnStatusCode: false,
    });

  const deleteBill = (auth, id) =>
    cy.request({
      method: 'DELETE',
      url: `bills/${id}`,
      auth: { bearer: auth },
      failOnStatusCode: false,
    });

  it('Validate the status code', function() {
    post(
      this.users.tommytoe.id,
      this.bills.second,
      this.users.tommytoe,
      this.groups.example,
      payers,
      debtors,
    )
      .its('status')
      .should('equal', 204);
    
    deleteBill(this.users.tommytoe.id, this.bills.second.id)
      .its('message')
      .should('equal', 'User not found');
  });
});
