import * as uuid from 'uuid';

describe('PUT /groups', () => {
  beforeEach(() => {
    cy.fixture('users.json').as('users');
    cy.fixture('groups.json').as('groups');
  });

  const put = (auth, name, id) =>
    cy.request({
      method: 'PUT',
      url: `groups/${id}`,
      auth: { bearer: auth },
      body: {
        name: name,
      },
      failOnStatusCode: false,
    });
  it('Validate group name has changed', function() {
    const groupName = 'New Group name';
    const result = [
      {
        _id: this.groups.example.id,
        name: groupName,
        currencyCode: this.groups.example.currencyCode,
        ownerId: this.users.johndoe.id,
      },
    ];

    put(this.users.johndoe.id, groupName, this.groups.example.id);

    cy.request({
      method: 'GET',
      url: `groups/${this.groups.example.id}`,
      auth: { bearer: this.users.johndoe.id },
    })
      .its('body')
      .should('deep.equal', result[0]);
  });
});
