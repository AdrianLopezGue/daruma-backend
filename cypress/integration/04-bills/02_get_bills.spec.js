import * as uuid from 'uuid';

describe('GET /bills/idGroup', () => {
  let userid = uuid.v4();

  beforeEach(() => {
    cy.fixture('users.json').as('users');
    cy.fixture('groups.json').as('groups');
  });

  const get = (auth, id) =>
    cy.request({
      method: 'GET',
      url: `bills/${id}`,
      auth: { bearer: auth }
    });

  it('Validate the status code', function() {
    get(this.users.johndoe.id, this.groups.example.id)
      .its('status')
      .should('equal', 200);
  });

  it('Validate group can be found after creation', function() {

    get(this.users.johndoe.id, this.groups.example.id)
      .its('body.length')
      .should('equal', 1);
  });
});
