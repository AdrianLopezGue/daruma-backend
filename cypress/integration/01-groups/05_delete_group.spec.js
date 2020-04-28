import * as uuid from 'uuid';

describe('DELETE /groups', () => {

  beforeEach(() => {
    cy.fixture('users.json').as('users');
    cy.fixture('groups.json').as('groups');
  });

  const deleteGroup = (auth, id) =>
    cy.request({
      method: 'DELETE',
      url: `groups/${id}`,
      auth: { bearer: auth },
      failOnStatusCode: false,
    });

  it('Validate the status code', function() {
    deleteGroup(this.users.johndoe.id, this.groups.example.id)
      .its('status')
      .should('equal', 204);
  });
});