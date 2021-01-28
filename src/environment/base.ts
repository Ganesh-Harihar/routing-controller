export const environment = {
  /**
   * App environment
   */
  production: false,
  /**
   * Identify itself. Current MicroService Name and ID in Database
   */
  service: {
    _id: 'routing controller',
    name: 'Routing Contoller',
    url: '/routing-controller',
    description: 'Routing Contoller',
    serviceType: 'personal'
  },
  /**
   * App running port
   */
  port: process.env.PORT || 3000,
  /**
   * Logger
   */
  log: {
    format: process.env.LOG_FORMAT || 'combined',
    fileLogger: {
      level: 'debug',
      directoryPath: process.env.LOG_DIR_PATH || (process.cwd() + '/logs/'),
      fileName: process.env.LOG_FILE || 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  maxFailedCount: 3,
  loginFailedInterval: 4,
  baseURI: process.env.DOMAIN,
};
