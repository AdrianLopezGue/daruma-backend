import * as uuid from 'uuid';

describe('POST /members', () => {
  let groupid;
  let userid;
  let memberid;

  const post = (auth, member) =>
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

  beforeEach(() => {
    cy.task('db:clean');

    groupid = uuid.v4();
    userid = uuid.v4();
    memberid = uuid.v4();

    cy.fixture('groups.json').then(groups => {
      groups.example.id = groupid;

      postGroup(userid, groups.example, userid)
        .its('status')
        .should('equal', 204);
    });
  });

  it('Creates a member', function() {
    cy.fixture('members.json').then(members => {
      members.tommytoe.id = memberid;
      members.tommytoe.groupId = groupid;

      post(userid, members.tommytoe)
        .its('status')
        .should('equal', 204);
    });
  });

  it('Cannot add new member to unknown group', function() {
    cy.fixture('members.json').then(members => {
      members.tommytoe.id = memberid;
      members.tommytoe.groupId = memberid;

      post(userid, members.tommytoe)
        .its('status')
        .should('equal', 404);
    });
  });

  it('Check if member with exact name is already in group', function() {
    cy.fixture('members.json').then(members => {
      members.johndoe.id = memberid;
      members.johndoe.groupId = groupid;

      post(userid, members.johndoe)
        .its('status')
        .should('equal', 409);
    });
  });
});
