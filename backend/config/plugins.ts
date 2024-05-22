export default () => ({
  'config-sync': {
    enabled: true,
    config: {
      importOnBootstrap: false,
      // customTypes: [
      //     {
      //         uid: 'api::meeting.meeting',
      //         configName: 'Meeting',
      //         queryString: 'meeting'
      //     }

      // ],

      excludedConfig: [
        'core-store.plugin_users-permissions_grant',
        'core-store.plugin_upload_metrics',
        'core-store.strapi_content_types_schema',
        'core-store.ee_information',
        'core-store.plugin_migrations_version'
      ],
    },
  },
  migrations: {
    enabled: true,
    config: {
      autoStart: true,
      migrationFolderPath: 'migrations',
    },
  },
  'entity-relationship-chart': {
    enabled: false,
    config: {
      // By default all contentTypes and components are included.
      // To exlclude strapi's internal models, use:
      exclude: [
        'strapi::core-store',
        'webhook',
        'admin::permission',
        'admin::user',
        'admin::role',
        'admin::api-token',
        'plugin::upload.file',
        'plugin::i18n.locale',
        'plugin::users-permissions.permission',
        'plugin::users-permissions.role',
      ],
    },
  },
})
