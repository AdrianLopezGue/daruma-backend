import { DebtorId } from '../model/debtor-id';
import { Debtor } from '../model/debtor';

export interface Debtors {
  find(debtorId: DebtorId): Promise<Debtor> | null;
  get(debtorId: DebtorId): Promise<Debtor>;
  save(debtor: Debtor): void;
}
