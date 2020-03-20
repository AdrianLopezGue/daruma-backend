export class GroupIdNotFoundError extends Error {
  public static withString(groupId: string): GroupIdNotFoundError {
    return new GroupIdNotFoundError(`Group Id ${groupId} not found.`);
  }
}
