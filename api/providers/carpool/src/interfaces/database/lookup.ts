import { CarpoolStatusEnum, Id, Uuid } from '../common';

export interface SelectableCarpoolStatus {
  _id: Id;
  created_at: Date;
  updated_at: Date;
  operator_id: Id;
  operator_journey_id: Uuid;
  operator_trip_id: Uuid;
  acquisition_last_event_id: Id;
  acquisition_status: CarpoolStatusEnum;
  incentive_last_event_id: Id;
  incentive_status: CarpoolStatusEnum;
  fraud_last_event_id: Id;
  fraud_status: CarpoolStatusEnum;
}
