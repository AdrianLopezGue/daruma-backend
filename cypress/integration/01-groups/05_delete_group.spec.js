import * as uuid from 'uuid';

describe('DELETE /groups', () => {
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

    const deleteGroup = (auth, id) =>
    cy.request({
      method: 'DELETE',
      url: `groups/${id}`,
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

  it('Validate group has been deleted', function() {
    cy.fixture('groups.json').then(groups => {
    groups.example.id = groupid;

    deleteGroup(userid, groups.example.id)
        .its('status')
        .should('equal', 204);
    });   
  });
});