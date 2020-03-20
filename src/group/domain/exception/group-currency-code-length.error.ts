export class GroupCurrencyCodeLengthError extends Error {
  public static withString(): GroupCurrencyCodeLengthError {
    return new GroupCurrencyCodeLengthError(
      `Group Currency Code is different to 3`,
    );
  }
}
