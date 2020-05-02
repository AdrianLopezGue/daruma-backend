import * as uuid from 'uuid';

describe('PUT /groups', () => {
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

  it('Validate group name has changed', function() {
    cy.fixture('groups.json').then(groups => {

      const groupName = 'New Group name';

      const result = [
      {
        _id: groupid,
        name: groupName,
        currencyCode: groups.example.currencyCode,
        ownerId: userid,
      },
    ];

    put(userid, groupName, groupid);

    cy.request({
      method: 'GET',
      url: `groups/${groupid}`,
      auth: { bearer: userid },
    })
      .its('body')
      .should('deep.equal', result[0]);
    });   
  });
});
