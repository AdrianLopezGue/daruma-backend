import * as uuid from 'uuid';

describe('GET /groups/id', () => {
  let userid;
  let groupid;

  const get = (auth, id) =>
    cy.request({
      method: 'GET',
      url: `groups/${id}`,
      auth: { bearer: auth },
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
    cy.fixture('groups.json').then(groups => {
      get(userid, groupid)
        .its('status')
        .should('equal', 200);
    });
  });

  it('Validate group can be found after creation', function() {
    cy.fixture('groups.json').then(groups => {
      const result = [
        {
          _id: groupid,
          name: groups.example.name,
          currencyCode: groups.example.currencyCode,
          ownerId: userid,
        },
      ];

      get(userid, groupid)
        .its('body')
        .should('deep.equal', result[0]);
    });
  });

  it('Validate cannot access to unknown group', function() {
    cy.fixture('users.json').then(users => {
      const otherGroupId = uuid.v4();

      users.johndoe.id = userid;
      get(users.johndoe.id, otherGroupId)
        .its('body')
        .should('have.length', 0);
    });
  });
});
