export class GroupIdAlreadyRegisteredError extends Error {
  public static withString(groupId: string): GroupIdAlreadyRegisteredError {
    return new GroupIdAlreadyRegisteredError(
      `GroupId ${groupId} already taken.`,
    );
  }
}
