import * as uuid from 'uuid';

describe('GET /groups', () => {
  let userid = uuid.v4();

  before(() => {
    cy.task('db:clean');
    cy.task('es:clean');
  });

  beforeEach(() => {
    cy.fixture('users.json').as('users');
  });

  const get = auth =>
    cy.request({
      method: 'GET',
      url: 'groups',
      auth: { bearer: auth },
    });

  it('Validate the status code', function() {
    get(this.users.johndoe.id)
      .its('status')
      .should('equal', 200);
  });

  it('Validate empty content', function() {
    get(this.users.johndoe.id)
      .its('body')
      .should('have.length', 0);
  });
});
