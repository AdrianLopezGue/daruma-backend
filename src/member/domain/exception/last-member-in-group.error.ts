export class LastMemberInGroupError extends Error {
    public static withString(memberId: string): LastMemberInGroupError {
      return new LastMemberInGroupError(`Cannot delete last member in group (${memberId})`);
    }
  }
  