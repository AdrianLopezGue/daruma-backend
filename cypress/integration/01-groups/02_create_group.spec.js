import * as uuid from 'uuid';

describe('POST /groups', () => {

  beforeEach(() => {
    cy.task('db:clean');
  });

  const post = (auth, group, ownerid) =>
    cy.request({
      method: 'POST',
      url: 'groups',
      auth: { bearer: auth },
      body: {
        groupId: group.id,
        name: group.name,
        currencyCode: group.currencyCode,
        owner: { id: ownerid, name: 'John Doe' },
        members: [],
      },
      failOnStatusCode: false,
    });

  it('Creates a group', function() {
    cy.fixture('groups.json').then(groups => {
      const userid = uuid.v4();
      groups.example.id = uuid.v4();

      post(userid, groups.example, userid)
        .its('status')
        .should('equal', 204);
    });
  });

  it('Validate the user belongs to group', function() {
    cy.fixture('groups.json').then(groups => {
      const userid = uuid.v4();
      const otherUser = uuid.v4();
      groups.example.id = uuid.v4();

      post(otherUser, groups.example, userid)
        .its('status')
        .should('equal', 403);
    });
  });
});
