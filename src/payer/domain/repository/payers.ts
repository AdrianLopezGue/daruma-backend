import { PayerId } from '../model/payer-id';
import { Payer } from '../model/payer';

export interface Payers {
  find(payerId: PayerId): Promise<Payer> | null;
  get(payerId: PayerId): Promise<Payer>;
  save(payer: Payer): void;
}
