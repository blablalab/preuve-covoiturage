const template1 = {
  parent_id: null,
  status: 'template',
  name: 'Encourager financièrement le covoiturage',
  description: "Campagne d'incitation financière au covoiturage à destination des conducteurs et des passagers.",
  global_rules: [
    {
      slug: 'rank_whitelist_filter',
      parameters: ['A', 'B', 'C'],
    },
    {
      slug: 'distance_range_filter',
      parameters: {
        min: 2000,
        max: 150000,
      },
    },
    {
      slug: 'weekday_filter',
      parameters: [0, 1, 2, 3, 4, 5, 6],
    },
  ],
  rules: [
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 0,
          max: 50000,
        },
      },
      {
        slug: 'passenger_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 10,
      },
      {
        slug: 'per_km',
        parameters: true,
      },
    ],
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 0,
          max: 50000,
        },
      },
      {
        slug: 'driver_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 10,
      },
      {
        slug: 'per_passenger',
        parameters: true,
      },
      {
        slug: 'per_km',
        parameters: true,
      },
    ],
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 50000,
          max: 150000,
        },
      },
      {
        slug: 'passenger_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 500,
      },
    ],
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 50000,
          max: 150000,
        },
      },
      {
        slug: 'driver_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 500,
      },
      {
        slug: 'per_passenger',
        parameters: true,
      },
    ],
  ],
  ui_status: {
    for_driver: true,
    for_passenger: true,
    for_trip: false,
    staggered: false,
  },
  start_date: null,
  end_date: null,
  unit: 'euro',
};

const template2 = {
  parent_id: null,
  status: 'template',
  name: 'Récompenser le covoiturage',
  description:
    "Campagne d'incitation basée sur un système de gratification par points donnant accès à un catalogue de récompenses (place de parking, place de piscine, composteur, etc.)",
  global_rules: [
    {
      slug: 'rank_whitelist_filter',
      parameters: ['A', 'B', 'C'],
    },
    {
      slug: 'weekday_filter',
      parameters: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      slug: 'distance_range_filter',
      parameters: {
        min: 2000,
        max: 150000,
      },
    },
  ],
  rules: [
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 0,
          max: 50000,
        },
      },
      {
        slug: 'passenger_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 1,
      },
      {
        slug: 'per_km',
        parameters: true,
      },
    ],
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 0,
          max: 50000,
        },
      },
      {
        slug: 'driver_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 1,
      },
      {
        slug: 'per_passenger',
        parameters: true,
      },
      {
        slug: 'per_km',
        parameters: true,
      },
    ],
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 50000,
          max: 150000,
        },
      },
      {
        slug: 'passenger_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 50,
      },
    ],
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 50000,
          max: 150000,
        },
      },
      {
        slug: 'driver_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 50,
      },
      {
        slug: 'per_passenger',
        parameters: true,
      },
    ],
  ],
  ui_status: {
    for_driver: true,
    for_passenger: true,
    for_trip: false,
    staggered: false,
  },
  start_date: null,
  end_date: null,
  unit: 'point',
};

const template3 = {
  parent_id: null,
  status: 'template',
  name: 'Limiter le trafic en semaine',
  description: "Campagne d'incitation pour limiter le trafic en semaine.",
  global_rules: [
    {
      slug: 'weekday_filter',
      parameters: [0, 1, 2, 3, 4],
    },
    {
      slug: 'rank_whitelist_filter',
      parameters: ['A', 'B', 'C'],
    },
    {
      slug: 'time_range_filter',
      parameters: [
        {
          start: 6,
          end: 20,
        },
      ],
    },
    {
      slug: 'distance_range_filter',
      parameters: {
        min: 2000,
        max: 150000,
      },
    },
    {
      slug: 'max_amount_per_target_restriction',
      parameters: {
        target: 'driver',
        amount: 8,
        period: 'day',
      },
    },
    {
      slug: 'max_amount_per_target_restriction',
      parameters: {
        target: 'passenger',
        amount: 2,
        period: 'day',
      },
    },
  ],
  rules: [
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 0,
          max: 50000,
        },
      },
      {
        slug: 'passenger_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 10,
      },
      {
        slug: 'per_km',
        parameters: true,
      },
    ],
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 0,
          max: 50000,
        },
      },
      {
        slug: 'driver_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 10,
      },
      {
        slug: 'per_passenger',
        parameters: true,
      },
      {
        slug: 'per_km',
        parameters: true,
      },
    ],
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 50000,
          max: 150000,
        },
      },
      {
        slug: 'passenger_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 500,
      },
    ],
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 50000,
          max: 150000,
        },
      },
      {
        slug: 'driver_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 500,
      },
      {
        slug: 'per_passenger',
        parameters: true,
      },
    ],
  ],
  ui_status: {
    for_driver: true,
    for_passenger: true,
    for_trip: false,
    staggered: false,
  },
  start_date: null,
  end_date: null,
  unit: 'euro',
};

const template4 = {
  parent_id: null,
  status: 'template',
  name: 'Limiter la pollution',
  description: "Campagne d'incitation financière activable en cas de pic de pollution pour encourager le covoiturage.",
  global_rules: [
    {
      slug: 'weekday_filter',
      parameters: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      slug: 'rank_whitelist_filter',
      parameters: ['A', 'B', 'C'],
    },
    {
      slug: 'distance_range_filter',
      parameters: {
        min: 2000,
        max: 150000,
      },
    },
    {
      slug: 'max_amount_per_target_restriction',
      parameters: {
        target: 'driver',
        amount: 8,
        period: 'day',
      },
    },
    {
      slug: 'max_amount_per_target_restriction',
      parameters: {
        target: 'passenger',
        amount: 2,
        period: 'day',
      },
    },
  ],
  rules: [
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 0,
          max: 50000,
        },
      },
      {
        slug: 'passenger_only_filter',
        parameters: true,
      },
      {
        slug: 'cost_based_amount',
        parameters: true,
      },
    ],
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 0,
          max: 50000,
        },
      },
      {
        slug: 'driver_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 10,
      },
      {
        slug: 'per_passenger',
        parameters: true,
      },
      {
        slug: 'per_km',
        parameters: true,
      },
    ],
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 50000,
          max: 150000,
        },
      },
      {
        slug: 'passenger_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 500,
      },
    ],
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 50000,
          max: 150000,
        },
      },
      {
        slug: 'driver_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 500,
      },
      {
        slug: 'per_passenger',
        parameters: true,
      },
    ],
  ],
  ui_status: {
    for_driver: true,
    for_passenger: true,
    for_trip: false,
    staggered: false,
  },
  start_date: null,
  end_date: null,
  unit: 'euro',
};

const template5 = {
  parent_id: null,
  status: 'template',
  name: 'Limiter les embouteillages du week-end',
  description:
    "Campagne d'incitation financière pour limiter les embouteillages les week-end notamment en cas de chassé croisé. ",
  global_rules: [
    {
      slug: 'weekday_filter',
      parameters: [4, 6],
    },
    {
      slug: 'rank_whitelist_filter',
      parameters: ['A', 'B', 'C'],
    },
    {
      slug: 'distance_range_filter',
      parameters: {
        min: 2000,
        max: 150000,
      },
    },
    {
      slug: 'time_range_filter',
      parameters: [
        {
          start: 12,
          end: 23,
        },
      ],
    },
  ],
  rules: [
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 0,
          max: 50000,
        },
      },
      {
        slug: 'driver_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 10,
      },
      {
        slug: 'per_passenger',
        parameters: true,
      },
      {
        slug: 'per_km',
        parameters: true,
      },
    ],
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 50000,
          max: 150000,
        },
      },
      {
        slug: 'driver_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 500,
      },
      {
        slug: 'per_passenger',
        parameters: true,
      },
    ],
  ],
  ui_status: {
    for_driver: true,
    for_passenger: false,
    for_trip: false,
    staggered: false,
  },
  start_date: null,
  end_date: null,
  unit: 'euro',
};

const template6 = {
  parent_id: null,
  status: 'template',
  name: "Limiter le trafic lors d'un évènement ponctuel",
  description: "Campagne d'incitation financière au covoiturage pour un événement ponctuel.",
  global_rules: [
    {
      slug: 'weekday_filter',
      parameters: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      slug: 'rank_whitelist_filter',
      parameters: ['A', 'B', 'C'],
    },
    {
      slug: 'distance_range_filter',
      parameters: {
        min: 2000,
        max: 150000,
      },
    },
  ],
  rules: [
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 0,
          max: 50000,
        },
      },
      {
        slug: 'passenger_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 10,
      },
      {
        slug: 'per_km',
        parameters: true,
      },
    ],
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 0,
          max: 50000,
        },
      },
      {
        slug: 'driver_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 10,
      },
      {
        slug: 'per_passenger',
        parameters: true,
      },
      {
        slug: 'per_km',
        parameters: true,
      },
    ],
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 50000,
          max: 150000,
        },
      },
      {
        slug: 'passenger_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 500,
      },
    ],
    [
      {
        slug: 'distance_range_filter',
        parameters: {
          min: 50000,
          max: 150000,
        },
      },
      {
        slug: 'driver_only_filter',
        parameters: true,
      },
      {
        slug: 'fixed_amount',
        parameters: 500,
      },
      {
        slug: 'per_passenger',
        parameters: true,
      },
    ],
  ],
  ui_status: {
    for_driver: true,
    for_passenger: true,
    for_trip: false,
    staggered: false,
  },
  start_date: null,
  end_date: null,
  unit: 'euro',
};

const template7 = {
  parent_id: null,
  status: 'template',
  name: 'Gratuité du covoiturage pour les passagers',
  description:
    "Campagne d'incitation ou la participation financière du passager est pris en charge par la collectivité.",
  global_rules: [
    {
      slug: 'rank_whitelist_filter',
      parameters: ['A', 'B', 'C'],
    },
    {
      slug: 'weekday_filter',
      parameters: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      slug: 'distance_range_filter',
      parameters: {
        min: 2000,
        max: 150000,
      },
    },
  ],
  rules: [
    [
      {
        slug: 'passenger_only_filter',
        parameters: true,
      },
      {
        slug: 'cost_based_amount',
        parameters: true,
      },
    ],
  ],
  ui_status: {
    for_driver: false,
    for_passenger: true,
    for_trip: false,
    staggered: false,
  },
  start_date: null,
  end_date: null,
  unit: 'euro',
};
