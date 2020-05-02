import * as uuid from 'uuid';

describe('POST /user', () => {
  beforeEach(() => {
    cy.task('db:clean');
  });

  const post = (auth, user) =>
    cy.request({
      method: 'POST',
      url: 'users',
      auth: { bearer: auth },
      body: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      failOnStatusCode: false,
    });

  it('creates an user', function() {
    cy.fixture('users.json').then(users => {
      users.johndoe.id = uuid.v4();

      post(users.johndoe.id, users.johndoe)
        .its('status')
        .should('equal', 204);
    });
  });

  it('check user is logged', function() {
    cy.fixture('users.json').then(users => {
      users.johndoe.id = uuid.v4();
      const otherUser = uuid.v4();

      post(otherUser, users.johndoe)
        .its('status')
        .should('equal', 403);
    });
  });
});
