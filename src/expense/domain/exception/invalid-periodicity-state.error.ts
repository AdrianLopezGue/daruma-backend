export class InvalidPeriodicityStateError extends Error {
    static withPeriodicityState(value: string): InvalidPeriodicityStateError {
      return new this('${value} is not a valid periodicity state');
    }
  }