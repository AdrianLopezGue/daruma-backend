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
    cy.task('db:clean');
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
    cy.fixture('users.json').then(users => {
      cy.fixture('groups.json').then(groups => {
        cy.fixture('bills.json').then(bills => {
          users.johndoe.id = uuid.v4();
          groups.example.id = uuid.v4();
          bills.example.id = uuid.v4();

          post(
            users.johndoe.id,
            bills.example,
            users.johndoe,
            groups.example,
            payers,
            debtors,
          )
          .its('status')
          .should('equal', 204);
        });
      });      
    });    
  });

  it('Validate the creator is an authenticated user', function() {
    cy.fixture('users.json').then(users => {
      cy.fixture('groups.json').then(groups => {
        cy.fixture('bills.json').then(bills => {
          users.johndoe.id = uuid.v4();
          groups.example.id = uuid.v4();
          bills.example.id = uuid.v4();

          const otherUser = uuid.v4();

          post(
            otherUser,
            bills.example,
            users.johndoe,
            groups.example,
            payers,
            debtors,
          )
            .its('status')
            .should('equal', 403);
        });
      });      
    });    
  });

  it('Validate the creator is a member of the group', function() {
    cy.fixture('users.json').then(users => {
      cy.fixture('groups.json').then(groups => {
        cy.fixture('bills.json').then(bills => {
          users.johndoe.id = uuid.v4();
          users.tommytoe.id = uuid.v4();
          groups.example.id = uuid.v4();
          bills.example.id = uuid.v4();

          cy.request({
            method: 'POST',
            url: 'users',
            auth: { bearer: users.tommytoe.id },
            body: {
              id: users.tommytoe.id,
              name: users.tommytoe.name,
              email: users.tommytoe.email,
            },
            failOnStatusCode: false,
          })
            .its('status')
            .should('equal', 204);

            post(
              users.tommytoe.id,
              bills.example,
              users.tommytoe,
              groups.example,
              payers,
              debtors,
            )
              .its('status')
              .should('equal', 409);
        });
      });      
    });
  });
});
