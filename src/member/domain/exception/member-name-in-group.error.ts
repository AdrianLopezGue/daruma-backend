export class MemberNameAlreadyRegisteredError extends Error {
  public static withString(
    memberName: string,
  ): MemberNameAlreadyRegisteredError {
    return new MemberNameAlreadyRegisteredError(
      `Member Name ${memberName} already in group.`,
    );
  }
}
