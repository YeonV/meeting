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
          
          // ] 
      }
  },
  'migrations': {
    enabled: true,
    config: {
      autoStart: true,
      migrationFolderPath : 'migrations'
    },
  },
  "entity-relationship-chart": {
      enabled: false,
      config: {
        // By default all contentTypes and components are included.
        // To exlclude strapi's internal models, use:
        exclude: [
          "strapi::core-store",
          "webhook",
          "admin::permission",
          "admin::user",
          "admin::role",
          "admin::api-token",
          "plugin::upload.file",
          "plugin::i18n.locale",
          "plugin::users-permissions.permission",
          "plugin::users-permissions.role"
        ],
      },
    },
});
