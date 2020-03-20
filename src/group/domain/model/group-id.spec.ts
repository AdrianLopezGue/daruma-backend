import { GroupId } from './group-id';

describe('GroupId', () => {
  const uuidA = '1061abe8-37e5-4623-8696-a9fd40797f73';
  const uuidB = 'f75dde03-2c8b-4e5a-89a2-ad22d52c18cf';

  it('should be an uuid v4', () => {
    const vo = GroupId.fromString(uuidA);

    expect(vo.value).toBe(uuidA);
  });

  it('should be equal to other vo with the same uuid', () => {
    const voA = GroupId.fromString(uuidA);
    const voB = GroupId.fromString(uuidA);

    expect(voA.equals(voB)).toBeTruthy();
  });

  it('should be diferent to other vo with other uuid', () => {
    const voA = GroupId.fromString(uuidA);
    const voB = GroupId.fromString(uuidB);

    expect(voA.equals(voB)).toBeFalsy();
  });

  it('should not accept invalid uuid', () => {
    expect(() => {
      GroupId.fromString('invalid');
    }).toThrow();
  });
});
