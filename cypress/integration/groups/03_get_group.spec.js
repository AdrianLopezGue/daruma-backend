import * as uuid from 'uuid';

describe('GET /groups/id', () => {
  let userid = uuid.v4();

  before(() => {
    cy.task('db:clean');
    cy.task('es:clean');
  });

  beforeEach(() => {
    cy.fixture('users.json').as('users');
    cy.fixture('groups.json').as('groups');
  });

  const get = (auth, id) =>
    cy.request({
      method: 'GET',
      url: 'groups/{id}?',
      auth: { bearer: auth },
      qs: { id: id }
    });

  it('Validate the status code', function() {
    get(this.users.johndoe.id, this.groups.example.id)
      .its('status')
      .should('equal', 200);
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

  it('Validate group can be found after creation', function() {

    const result = [
        {
          _id: this.groups.example.id,
          name: this.groups.example.name,
          currencyCode: this.groups.example.currencyCode,
          ownerId: this.users.johndoe.id,
        }
      ];

    post(this.users.johndoe.id, this.groups.example, this.users.johndoe)

    get(this.users.johndoe.id, this.groups.example.id)
      .its('body')
      .should('deep.equal', result[0]);
  });

  it('Validate cannot access to unknown group', function() {

    const otherGroupId = uuid.v4();

    get(this.users.johndoe.id, otherGroupId)
      .its('body')
      .should('have.length', 0);
  });
});
