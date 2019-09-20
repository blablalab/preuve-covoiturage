import { StatDateTotalInterface, StatDayTotalInterface, StatInterface } from '../../interfaces/stat/statInterface';

export class Stat {
  public _id: string;
  public carpoolers: {
    total: number;
    days: StatDateTotalInterface[];
    months: StatDayTotalInterface[];
  };
  // tslint:disable-next-line:variable-name
  public carpoolers_per_vehicule: {
    total: number;
    days: StatDateTotalInterface[];
    months: StatDayTotalInterface[];
  };
  public distance: {
    total: number;
    days: StatDateTotalInterface[];
    months: StatDayTotalInterface[];
  };
  public operators: {
    total: number;
    imgIds: [];
  };
  public trips: {
    total: number;
    total_subsidized: number;
    days: {
      date: string;
      total: number;
      total_subsidized: number;
    }[];
    months: {
      day: number;
      total: number;
      total_subsidized: number;
    }[];
  };
  constructor(obj: StatInterface) {
    this._id = obj._id;
    this.carpoolers = obj.carpoolers;
    this.carpoolers_per_vehicule = obj.carpoolers_per_vehicule;
    this.distance = obj.distance;
    this.operators = obj.operators;
    this.trips = obj.trips;
  }
}
