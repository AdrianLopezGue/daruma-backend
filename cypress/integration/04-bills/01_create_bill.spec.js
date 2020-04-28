import * as uuid from 'uuid';

describe('POST /bills', () => {
  const payers = [
    {
      id: '7150c2b3-239e-41c3-9264-37396057c756',
      money: 100,
    },
    {
      id: '2d811427-ff8e-4886-89b9-240ae6024549',
      money: 200,
    },
  ];

  const debtors = [
    {
      id: '7150c2b3-239e-41c3-9264-37396057c756',
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

  it('Validate the status code', function() {
    post(
      this.users.johndoe.id,
      this.bills.example,
      this.users.johndoe,
      this.groups.example,
      payers,
      debtors,
    )
      .its('status')
      .should('equal', 204);
  });

  it('Validate the creator is an authenticated user', function() {
    const otherUser = uuid.v4();
    post(
      otherUser,
      this.bills.example,
      this.users.johndoe,
      this.groups.example,
      payers,
      debtors,
    )
      .its('status')
      .should('equal', 403);
  });

  it('Validate the creator is a member of the group', function() {
    cy.request({
      method: 'POST',
      url: 'users',
      auth: { bearer: this.users.tommytoe.id },
      body: {
        id: this.users.tommytoe.id,
        name: this.users.tommytoe.name,
        email: this.users.tommytoe.email,
      },
      failOnStatusCode: false,
    })
      .its('status')
      .should('equal', 204);

    post(
      this.users.tommytoe.id,
      this.bills.example,
      this.users.tommytoe,
      this.groups.example,
      payers,
      debtors,
    )
      .its('status')
      .should('equal', 409);
  });
});
