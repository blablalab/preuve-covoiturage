declare function env(key: string, fallback?: string): any;

export const mail = {
  debug: env('NODE_ENV', 'local') === 'local',
  driver: 'mailjet',
  driverOptions: {
    public: env('APP_MAILJET_PUBLIC_KEY', ''),
    private: env('APP_MAILJET_PRIVATE_KEY', ''),
  },
  sendOptions: {
    template: env('APP_MAILJET_TEMPLATE', ''),
  },
  from: {
    name: env('APP_MAILJET_FROM_NAME', ''),
    email: env('APP_MAILJET_FROM_EMAIL', ''),
  },
  defaultSubject: 'Registre de preuve de covoiturage',
  to: {
    name: env('APP_MAILJET_DEBUG_NAME', ''),
    email: env('APP_MAILJET_DEBUG_EMAIL', ''),
  },
};
