import * as uuid from 'uuid';

describe('GET /members', () => {
  let userid;
  let groupid;

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

  const get = (auth, id) =>
    cy.request({
      method: 'GET',
      url: `members/${id}`,
      auth: { bearer: auth },
      failOnStatusCode: false,
    });

  beforeEach(() => {
    cy.task('db:clean');

    userid = uuid.v4();
    groupid = uuid.v4();

    cy.fixture('groups.json').then(groups => {
      groups.example.id = groupid;

      post(userid, groups.example, userid)
        .its('status')
        .should('equal', 204);
    });
  });

  it('Validate the status code', function() {
    cy.fixture('users.json').then(users => {
      users.johndoe.id = userid;

      get(users.johndoe.id, groupid)
      .its('status')
      .should('equal', 200);

    });    
  });

  it('Validate that cannot access to unknown group', function() {
    cy.fixture('users.json').then(users => {
      const otherGroup = uuid.v4();
      users.johndoe.id = userid;

      get(users.johndoe.id, otherGroup)
      .its('status')
      .should('equal', 404);
    });    
  });
});
