import * as uuid from 'uuid';

describe('GET /groups', () => {

  beforeEach(() => {
    cy.task('db:clean');
  });

  const get = auth =>
    cy.request({
      method: 'GET',
      url: 'groups',
      auth: { bearer: auth },
    });

  it('Validate the status code', function() {
    cy.fixture('users.json').then(users => {
      users.johndoe.id = uuid.v4();

      get(users.johndoe.id)
        .its('status')
        .should('equal', 200);
    });
  });

  it('Validate empty content', function() {
    cy.fixture('users.json').then(users => {
      users.johndoe.id = uuid.v4();

      get(users.johndoe.id)
      .its('body')
      .should('have.length', 0);
    });
  });
});
