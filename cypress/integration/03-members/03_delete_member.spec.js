import * as uuid from 'uuid';

describe('DELETE /members', () => {
  let userid;
  let groupid;
  let memberid;

  const postGroup = (auth, group, ownerid) =>
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

  const postMember = (auth, member) =>
    cy.request({
      method: 'POST',
      url: 'members',
      auth: { bearer: auth },
      body: {
        id: member.id,
        groupId: member.groupId,
        name: member.name,
      },
      failOnStatusCode: false,
    });

  const deleteMember = (auth, id) =>
    cy.request({
      method: 'DELETE',
      url: `members/${id}`,
      auth: { bearer: auth },
      failOnStatusCode: false,
    });

  beforeEach(() => {
    cy.task('db:clean');

    userid = uuid.v4();
    memberid = uuid.v4();
    groupid = uuid.v4();

    cy.fixture('groups.json').then(groups => {
      cy.fixture('members.json').then(members => {
        groups.example.id = groupid;
        members.tommytoe.id = memberid;
        members.tommytoe.groupId = groupid;

        postGroup(userid, groups.example, userid)
          .its('status')
          .should('equal', 204);

        postMember(userid, members.tommytoe)
          .its('status')
          .should('equal', 204);
      });
    });
  });

  it('Delete member', function() {
    deleteMember(userid, memberid)
      .its('status')
      .should('equal', 204);
  });

  it('Check that requester cannot be deleted', function() {
    deleteMember(userid, userid)
      .its('status')
      .should('equal', 403);
  });

  it('Check that cannot delete unknown member', function() {
    const anotherUserId = uuid.v4();

    deleteMember(userid, anotherUserId)
      .its('status')
      .should('equal', 404);
  });
});
