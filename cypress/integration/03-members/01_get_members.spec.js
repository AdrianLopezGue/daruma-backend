import * as uuid from 'uuid';

describe('GET /members', () => {
  let userid = uuid.v4();

  beforeEach(() => {
    cy.fixture('groups.json').as('groups');
    cy.fixture('users.json').as('users');
  });

  const get = (auth, id) =>
    cy.request({
      method: 'GET',
      url: `members/${id}`,
      auth: { bearer: auth },
    });

  const post = (auth, group, owner) =>
    cy.request({
      method: 'POST',
      url: 'groups',
      auth: { bearer: auth },
      body: {
        groupId: group.id,
        name: group.name,
        currencyCode: group.currencyCode,
        owner: { id: owner.id, name: owner.name },
        members: [],
      },
      failOnStatusCode: false,
    });

  it('Validate the status code', function() {
    get(this.users.johndoe.id, this.groups.example.id)
      .its('status')
      .should('equal', 200);
  });

  it('Validate that owner of group is a member', function() {
    post(this.users.johndoe.id, this.groups.example, this.users.johndoe);

    get(this.users.johndoe.id, this.groups.example.id)
      .its('body')
      .should('have.length', 1);
  });
});
