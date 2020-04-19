import * as uuid from 'uuid';

describe('PUT /groups', () => {

  before(() => {
    cy.task('db:clean');
    cy.task('es:clean');
  });

  beforeEach(() => {
    cy.fixture('users.json').as('users');
    cy.fixture('groups.json').as('groups');
  });

  const put = (auth, name, id) =>
    cy.request({
      method: 'PUT',
      url: 'groups/{id}?',
      auth: { bearer: auth },
      body: {
        name: name
      },
      qs: { id: id },
      failOnStatusCode: false,
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

    const get = (auth, id) =>
    cy.request({
      method: 'GET',
      url: 'groups',
      auth: { bearer: auth },
      qs: { id: id }
    });

  it('Validate the status code', function() {
    const groupName = 'New Group name';
    const result = [
      {
        _id: this.groups.example.id,
        name: this.groups.example.name,
        currencyCode: this.groups.example.currencyCode,
        ownerId: this.users.johndoe.id,
      },
    ];

    post(this.users.johndoe.id, this.groups.example, this.users.johndoe);

    put(this.users.johndoe.id, groupName, this.groups.example.id)
      .its('status')
      .should('equal', 204);
  });
});
