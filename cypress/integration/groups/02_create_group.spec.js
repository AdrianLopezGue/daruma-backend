import * as uuid from 'uuid';

describe('POST /groups', () => {
  let userid = uuid.v4();
  let groupid = uuid.v4();

  before(() => {
    cy.task('db:clean');
    cy.task('es:clean');
  });

  beforeEach(() => {
    cy.fixture('users.json').as('users');
    cy.fixture('groups.json').as('groups');
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
    post(this.users.johndoe.id, this.groups.example, this.users.johndoe)
      .its('status')
      .should('equal', 204);
  });

  it('Validate the user belongs to group', function() {
    const otherUser = uuid.v4();
    post(otherUser, this.groups.example, this.users.johndoe)
      .its('status')
      .should('equal', 403);
  });

  it('Validate group was created', function() {
    const result = [
      {
        _id: this.groups.example.id,
        name: this.groups.example.name,
        currencyCode: this.groups.example.currencyCode,
        ownerId: this.users.johndoe.id,
      },
    ];

    cy.request({
      method: 'GET',
      url: 'groups',
      auth: { bearer: this.users.johndoe.id },
    })
      .its('body')
      .should('deep.equal', result);
  });
});
