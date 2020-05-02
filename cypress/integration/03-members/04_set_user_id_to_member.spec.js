import * as uuid from 'uuid';

describe('PATCH /members', () => {
  let userid;
  let userid2;
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

  const patchMember = (auth, id) =>
    cy.request({
      method: 'PATCH',
      url: `members/${id}`,
      body: {
        idUser: auth,
      },
      auth: { bearer: auth },
      failOnStatusCode: false,
    });

  beforeEach(() => {
    cy.task('db:clean');

    userid = uuid.v4();
    userid2 = uuid.v4();
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

  it('Patch member', function() {
    patchMember(userid2, memberid)
      .its('status')
      .should('equal', 204);
  });

  it('Cannot set userId to unknown member', function() {
    const anotherMemberid = uuid.v4();
    patchMember(userid2, anotherMemberid)
      .its('status')
      .should('equal', 404);
  });
});