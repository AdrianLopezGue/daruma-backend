export class MemberIdAlreadyRegisteredError extends Error {
    public static withString(memberId: string): MemberIdAlreadyRegisteredError {
      return new MemberIdAlreadyRegisteredError(
        `MemberId ${memberId} already taken.`,
      );
    }
  }