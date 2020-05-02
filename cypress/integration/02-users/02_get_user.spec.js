import * as uuid from 'uuid';

describe('GET /users/id', () => {
  let userid;

  const get = (auth, id) =>
    cy.request({
      method: 'GET',
      url: `users/${id}`,
      auth: { bearer: auth },
      failOnStatusCode: false,
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

  beforeEach(() => {
    cy.task('db:clean');

    userid = uuid.v4();

    cy.fixture('users.json').then(users => {
      users.johndoe.id = userid;

      post(users.johndoe.id, users.johndoe)
        .its('status')
        .should('equal', 204);
    });
  });

  it('Validate the status code', function() {
    cy.fixture('users.json').then(users => {
      users.johndoe.id = userid;
      get(users.johndoe.id, users.johndoe.id)
        .its('status')
        .should('equal', 200);
    });
  });

  it('Validate cannot access to unknown group', function() {
    cy.fixture('users.json').then(users => {
      const otherUserId = uuid.v4();

      get(otherUserId, otherUserId)
      .its('status')
      .should('equal', 404);
    });
  });
});
