import { Config } from "@/config";
import { DashboardContext } from '@/context/DashboardProvider';
import { useApi } from "@/hooks/useApi";
import { BestFluxDataInterface } from "@/interfaces/observatoire/dataInterfaces";
import { fr } from "@codegouvfr/react-dsfr";
import { Table as TableStyled } from "@codegouvfr/react-dsfr/Table";
import { css } from "@emotion/react";
import styled from '@emotion/styled';
import { useContext } from 'react';

const Table = styled(TableStyled)(
  css`
  & th {
    text-align: center;
    line-height: 1rem;
    padding: .5rem;
  }
  & td {
    text-align: center;
    line-height: 1rem;
    padding: .5rem;
  }
`);

export default function BestFluxTable({ title, limit}: { title: string, limit: number }) {
  const { dashboard } =useContext(DashboardContext);
  const apiUrl = Config.get<string>('next.public_api_url', '');
  const url = `${apiUrl}/best-monthly-flux?code=${dashboard.params.code}&type=${dashboard.params.type}&year=${dashboard.params.year}&month=${dashboard.params.month}&limit=${limit}`;
  const { data, error, loading } = useApi<BestFluxDataInterface[]>(url);
  const dataTable = data ? data.map(d => [`${d.l_territory_1} - ${d.l_territory_2}`, d.journeys]) : []

  

  return (
    <>
      {loading && (
        <div className={fr.cx('fr-callout')}>
          <h3 className={fr.cx('fr-callout__title')}>{title}</h3>
          <div>Chargement en cours...</div>
        </div>
      )}
      {error && (
        <div className={fr.cx('fr-callout')}>
          <h3 className={fr.cx('fr-callout__title')}>{title}</h3>
          <div>{`Un problème est survenu au chargement des données: ${error}`}</div>
        </div>
      )}
      {!data || data.length == 0 && (
        <div className={fr.cx('fr-callout')}>
          <h3 className={fr.cx('fr-callout__title')}>{title}</h3>
          <div>Pas de données disponibles pour ce tableau...</div>
        </div>
      )}
      {!loading && !error && data && data.length > 0 && (
        <div className={fr.cx('fr-callout')}>
          <h3 className={fr.cx('fr-callout__title')}>{title}</h3>
          <style jsx>{`
            fr-table td {
              text-align: center;
              line-height: 1rem;
              padding: .5rem;
            }
          `}</style>
          <Table data={dataTable} headers={['Nom','Nombre']} bordered fixed colorVariant={'blue-ecume'} />
        </div>
      )}
    </>
  );
}