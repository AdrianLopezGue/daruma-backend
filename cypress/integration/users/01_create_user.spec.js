import * as uuid from 'uuid';

describe('POST /user', () => {

  beforeEach(() => {
    cy.fixture('users.json').as('users');
    cy.fixture('groups.json').as('groups');
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

  it('Validate the status code', function() {
    post(this.users.johndoe.id, this.users.johndoe)
      .its('status')
      .should('equal', 204);
  });

  it('Validate the user belongs to group', function() {
    const otherUser = uuid.v4();
    post(otherUser, this.users.johndoe)
      .its('status')
      .should('equal', 403);
  });
});
