import {
  OperatorsEnum,
  PolicyHandlerInterface,
  PolicyHandlerParamsInterface,
  PolicyHandlerStaticInterface,
  StatelessContextInterface,
} from '../../interfaces';
import { RunnableSlices } from '../../interfaces/engine/PolicyInterface';
import { NotEligibleTargetException } from '../exceptions/NotEligibleTargetException';
import {
  LimitTargetEnum,
  endsAt,
  isOperatorClassOrThrow,
  isOperatorOrThrow,
  onDistanceRange,
  onDistanceRangeOrThrow,
  perKm,
  perSeat,
  startsAndEndsAt,
  startsAt,
  watchForGlobalMaxAmount,
  watchForPersonMaxAmountByMonth,
  watchForPersonMaxTripByDay,
} from '../helpers';
import { TimestampedOperators, getOperatorsAt } from '../helpers/getOperatorsAt';
import { isAdultOrThrow } from '../helpers/isAdultOrThrow';
import { description } from './20240101_PaysDeLaLoire.html';
import { AbstractPolicyHandler } from './AbstractPolicyHandler';

// Politique de Pays de la Loire 2024
/* eslint-disable-next-line */
export const PaysDeLaLoire2024: PolicyHandlerStaticInterface = class extends AbstractPolicyHandler implements PolicyHandlerInterface {
  static readonly id = 'pdll_2024';

  protected operators: TimestampedOperators = [
    {
      date: new Date('2024-01-01T00:00:00+0100'),
      operators: [OperatorsEnum.BLABLACAR_DAILY, OperatorsEnum.KAROS, OperatorsEnum.KLAXIT, OperatorsEnum.MOBICOOP],
    },
    {
      date: new Date('2024-03-18T00:00:00+0100'),
      operators: [OperatorsEnum.BLABLACAR_DAILY, OperatorsEnum.KAROS, OperatorsEnum.MOBICOOP],
    },
  ];

  protected slices: RunnableSlices = [
    { start: 5_000, end: 17_000, fn: (ctx: StatelessContextInterface) => perSeat(ctx, 75) },
    {
      start: 17_000,
      end: 30_000,
      fn: (ctx: StatelessContextInterface) => perSeat(ctx, perKm(ctx, { amount: 10, offset: 17_000, limit: 29_500 })),
    },
    {
      start: 30_000,
      fn: (ctx: StatelessContextInterface) => 0,
    },
  ];

  constructor(public max_amount: number) {
    super();
    this.limits = [
      ['8C5251E8-AB82-EB29-C87A-2BF59D4F6328', 6, watchForPersonMaxTripByDay, LimitTargetEnum.Driver],
      ['5499304F-2C64-AB1A-7392-52FF88F5E78D', this.max_amount, watchForGlobalMaxAmount],
      ['ECDE3CD4-96FF-C9D2-BA88-45754205A798', 84_00, watchForPersonMaxAmountByMonth, LimitTargetEnum.Driver],
    ];
  }

  protected processExclusion(ctx: StatelessContextInterface) {
    isOperatorOrThrow(ctx, getOperatorsAt(this.operators, ctx.carpool.datetime));
    onDistanceRangeOrThrow(ctx, { min: 5_000, max: 60_001 });
    isOperatorClassOrThrow(ctx, ['C']);
    isAdultOrThrow(ctx);

    /*
      Exclure les trajets :
       - 244400404: Nantes Métropole -> Nantes Métropole,
       - 244900015: CU Angers Loire Métropole -> CU Angers Loire Métropole,
       - 247200132: CU Le Mans Métropole -> CU Le Mans Métropole,
       - 200071678: CA Agglomération du Choletais -> CA Agglomération du Choletais
     */
    if (
      startsAndEndsAt(ctx, { aom: ['244400404'] }) ||
      startsAndEndsAt(ctx, { aom: ['244900015'] }) ||
      startsAndEndsAt(ctx, { aom: ['247200132'] }) ||
      startsAndEndsAt(ctx, { aom: ['200071678'] })
    ) {
      throw new NotEligibleTargetException();
    }

    // Exclure les trajets qui ne sont pas dans l'AOM
    if (!startsAt(ctx, { reg: ['52'] }) || !endsAt(ctx, { reg: ['52'] })) {
      throw new NotEligibleTargetException();
    }
  }

  processStateless(ctx: StatelessContextInterface): void {
    this.processExclusion(ctx);
    super.processStateless(ctx);

    // Par kilomètre
    let amount = 0;
    for (const { start, fn } of this.slices) {
      if (onDistanceRange(ctx, { min: start })) {
        amount += fn(ctx);
      }
    }

    ctx.incentive.set(amount);
  }

  params(): PolicyHandlerParamsInterface {
    return {
      tz: 'Europe/Paris',
      slices: this.slices,
      operators: getOperatorsAt(this.operators),
      limits: {
        glob: this.max_amount,
      },
    };
  }

  describe(): string {
    return description;
  }
};
