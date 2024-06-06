import { _, datetz } from '@/deps.ts';
import { FlattenTripInterface } from '../actions/BuildExportAction.ts';
import { ExportTripInterface } from '../interfaces/index.ts';

export function normalizeExport(src: ExportTripInterface, timeZone: string): FlattenTripInterface {
  const { data, driver_incentive_raw, passenger_incentive_raw } = normalize(src, timeZone);

  // financial in euros
  data.driver_revenue = _.get(src, 'driver_revenue', 0) / 100;
  data.passenger_contribution = _.get(src, 'passenger_contribution', 0) / 100;

  for (let i = 0; i < 4; i++) {
    // normalize incentive in euro
    const id = i + 1;
    data[`passenger_incentive_${id}_siret`] = _.get(passenger_incentive_raw, `${i}.siret`);
    data[`passenger_incentive_${id}_amount`] = _.get(passenger_incentive_raw, `${i}.amount`, 0) / 100;
    data[`passenger_incentive_rpc_${id}_siret`] = _.get(data, `passenger_incentive_rpc_raw.${i}.siret`);
    data[`passenger_incentive_rpc_${id}_name`] = _.get(data, `passenger_incentive_rpc_raw.${i}.policy_name`);
    data[`passenger_incentive_rpc_${id}_amount`] = _.get(data, `passenger_incentive_rpc_raw.${i}.amount`, 0) / 100;
    data[`driver_incentive_${id}_siret`] = _.get(driver_incentive_raw, `${i}.siret`);
    data[`driver_incentive_${id}_amount`] = _.get(driver_incentive_raw, `${i}.amount`, 0) / 100;
    data[`driver_incentive_rpc_${id}_siret`] = _.get(data, `driver_incentive_rpc_raw.${i}.siret`);
    data[`driver_incentive_rpc_${id}_name`] = _.get(data, `driver_incentive_rpc_raw.${i}.policy_name`);
    data[`driver_incentive_rpc_${id}_amount`] = _.get(data, `driver_incentive_rpc_raw.${i}.amount`, 0) / 100;
  }
  return data;
}

export function normalizeOpendata(src: ExportTripInterface, timeZone: string): FlattenTripInterface {
  const { data, driver_incentive_raw, passenger_incentive_raw } = normalize(src, timeZone);

  data.has_incentive =
    driver_incentive_raw.length > 0 ||
    passenger_incentive_raw.length > 0 ||
    data.driver_incentive_rpc_raw?.length > 0 ||
    data.passenger_incentive_rpc_raw?.length > 0;

  return data;
}

function normalize(
  src: ExportTripInterface,
  timeZone: string,
): { data: FlattenTripInterface; driver_incentive_raw; passenger_incentive_raw } {
  const jsd = datetz.toZonedTime(src.journey_start_datetime, timeZone);
  const jed = datetz.toZonedTime(src.journey_end_datetime, timeZone);

  const data: FlattenTripInterface = {
    ...src,

    // format and convert to user timezone
    journey_start_datetime: datetz.format(jsd, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
    journey_start_date: datetz.format(jsd, 'yyyy-MM-dd', { timeZone }),
    journey_start_time: datetz.format(jsd, 'HH:mm:ss', { timeZone }),

    journey_end_datetime: datetz.format(jed, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
    journey_end_date: datetz.format(jed, 'yyyy-MM-dd', { timeZone }),
    journey_end_time: datetz.format(jed, 'HH:mm:ss', { timeZone }),

    // distance in meters
    journey_distance: src.journey_distance,
    journey_distance_calculated: src.journey_distance_calculated,
    journey_distance_anounced: src.journey_distance_anounced,

    // duration in minutes
    journey_duration: Math.round(src.journey_duration / 60),
    journey_duration_calculated: Math.round(src.journey_duration_calculated / 60),
    journey_duration_anounced: Math.round(src.journey_duration_anounced / 60),
  };

  const driver_incentive_raw = (_.get(src, 'driver_incentive_raw', []) || []).filter((i) => i.type === 'incentive');
  const passenger_incentive_raw = (_.get(src, 'passenger_incentive_raw', []) || []).filter((i) => i.type === 'incentive');

  return {
    data,
    driver_incentive_raw,
    passenger_incentive_raw,
  };
}
