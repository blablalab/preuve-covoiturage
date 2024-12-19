{{ config(
    materialized='incremental',
    unique_key=['year', 'code', 'type', 'direction'],
    post_hook=[
      "DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'newcomer_by_year_pkey') THEN ALTER TABLE {{ this }} ADD CONSTRAINT newcomer_by_year_pkey PRIMARY KEY (year, code, type, direction); END IF; END $$;"
      "CREATE INDEX IF NOT EXISTS newcomer_by_year_idx ON {{ this }} using btree(year, code, type, direction)",
    ]
  )
}}

SELECT
  extract('year' FROM start_date)::int AS year,
  a.code,
  b.l_territory                        AS libelle,
  a.type,
  a.direction,
  sum(a.new_drivers)                   AS new_drivers,
  sum(a.new_passengers)                AS new_passengers
FROM {{ ref('directions_newcomer_by_day') }} AS a
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
      extract('year' FROM start_date)
      >= (SELECT max(year) FROM {{ this }})
  {% endif %}
GROUP BY 1, 2, 3, 4, 5
