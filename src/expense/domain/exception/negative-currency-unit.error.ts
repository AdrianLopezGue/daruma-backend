export class NegativeCurrencyUnitError extends Error {
    public static withString(): NegativeCurrencyUnitError {
      return new NegativeCurrencyUnitError(
        `Currency unit can not be negative`,
      );
    }
  }