export class MemberIdNotFoundError extends Error {
  public static withString(memberId: string): MemberIdNotFoundError {
    return new MemberIdNotFoundError(`Member Id ${memberId} not found.`);
  }
}
