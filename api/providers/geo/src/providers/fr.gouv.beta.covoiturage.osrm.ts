import { get } from 'lodash';
import axios from 'axios';

import { PointInterface } from '../interfaces/PointInterface';

export class FrGouvBetaCovoiturageOsrm {
  static async route(start: PointInterface, end: PointInterface): Promise<{ distance: number; duration: number }> {
    const url = 'http://osrm.covoiturage.beta.gouv.fr:5000';
    const query = `${start.lon},${start.lat};${end.lon},${end.lat}`;

    const res = await axios.get(`${url}/route/v1/driving/${encodeURIComponent(query)}`);
    const route = get(res, 'data.routes', [{}])[0];
    const distance = get(route, 'distance', null);
    const duration = get(route, 'duration', null);

    if (!distance || !duration) throw new Error();

    return { distance, duration };
  }
}
