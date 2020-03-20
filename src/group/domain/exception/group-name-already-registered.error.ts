export class GroupNameAlreadyRegisteredError extends Error {
  public static withString(groupName: string): GroupNameAlreadyRegisteredError {
    return new GroupNameAlreadyRegisteredError(
      `Group name ${groupName} already taken.`,
    );
  }
}
