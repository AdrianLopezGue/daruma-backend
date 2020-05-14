import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RecurringBillService } from './recurring-bill.service';
import { BILLS, Bills } from '../../../bill/domain/repository/index';
import { BillId } from '../../../bill/domain/model/bill-id';
import { BillService, BILL_SERVICE } from '../../../bill/infrastructure/service/bill.service';
import { v4 } from 'uuid';
import { ParticipantDto } from '../../../bill/infrastructure/dto/bill.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @Inject(BILLS) private readonly bills: Bills,
    private readonly recurringBillService: RecurringBillService,
    private readonly billService: BillService,
  ) {}

  @Cron('41 21 * * *')
  async renovateRecurringBill() {
    this.logger.debug('Renovation Recurring Bills starts');

    const recurringBillToRenovate = await this.recurringBillService.getRecurringBillsExpireToday();

    recurringBillToRenovate.map(async (recurringBill) => {
        const billToCopy = await this.bills.find(BillId.fromString(recurringBill.billId));
        const newBillId = v4();
        const newRecurringBillId = v4();

        try{
          await this.billService.createBill(
            newBillId,
            billToCopy.groupId.value,
            billToCopy.name.value,
            billToCopy.amount.money.props.value,
            billToCopy.amount.currencyCode.props.value,
            billToCopy.payers.map((payer) => new ParticipantDto(payer.props.memberId.props.value, payer.props.amount.props.value)),
            billToCopy.debtors.map((debtor) => new ParticipantDto(debtor.props.memberId.props.value, debtor.props.amount.props.value)),
            new Date(Date.now()),
            billToCopy.creator.value
        )
        } catch(e){
          console.debug(e);
        }

        this.recurringBillService.removeRecurringBill(recurringBill.id);

        this.recurringBillService.createRecurringBill(
            newRecurringBillId,
            newBillId,
            recurringBill.groupId,
            new Date(Date.now()),
            recurringBill.period,
        )
    });

    this.logger.debug('Renovation Recurring Bills ends');
  }
}