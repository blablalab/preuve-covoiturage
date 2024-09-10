{{ config(materialized='incremental',
  unique_key=['year', 'trimester', 'code', 'type', 'direction'],
  post_hook=[
      "DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'incentive_by_trimester_pkey') THEN ALTER TABLE {{ this }} ADD CONSTRAINT incentive_by_trimester_pkey PRIMARY KEY (year, trimester, type, code, direction); END IF; END $$;"
      "CREATE INDEX IF NOT EXISTS incentive_by_trimester_idx ON {{ this }} using btree(year, trimester, type, code, direction)",
    ]
) }}

SELECT
  extract('year' FROM start_date)::int  AS year,
  extract('quarter' FROM start_date)::int AS trimester,
  a.code,
  b.l_territory AS libelle,
  a.type,
  a.direction,
  sum(a.collectivite)                         AS collectivite,
  sum(a.operateur)                         AS operateur,
  sum(a.autres)                         AS autres
FROM {{ ref('directions_incentive_by_day') }} AS a
LEFT JOIN
  (
    SELECT
      territory,
      l_territory,
      type,
      geom
    FROM {{ source('geo', 'perimeters_centroid') }}
    WHERE year = geo.get_latest_millesime()
  ) AS b
  ON a.code = b.territory AND a.type = b.type
WHERE
  a.code IS NOT null
  {% if is_incremental() %}
    AND
      (extract('year' FROM start_date) * 10 + extract('quarter' FROM start_date))
      >= (SELECT max(year * 10 + trimester) FROM {{ this }})
  {% endif %}
GROUP BY 1, 2, 3, 4, 5, 6
