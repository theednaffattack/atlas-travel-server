import appRoot from "app-root-path";
import winston from "winston";

// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: "info",
    filename: `${appRoot}/src/logs/app.log.json`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true
  }
};

const gqlArgCaptureOptions = {
  file: {
    level: "info",
    filename: `${appRoot}/src/logs/app.gql_capture_args.log.json`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  }
};

const deviceSniffingOptions = {
  file: {
    level: "info",
    filename: `${appRoot}/src/logs/app.device_sniffing.log.json`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  }
};

// instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
});

// capture GraphQL request args and save to file
const captureArgs = winston.createLogger({
  transports: [new winston.transports.File(gqlArgCaptureOptions.file)],
  exitOnError: false // do not exit on handled exceptions
});

// capture GraphQL request ...theRest (non-GQL args) and save to file
// Use for device sniffing and (eventual) multi-device logout
const deviceSniffing = winston.createLogger({
  transports: [new winston.transports.File(deviceSniffingOptions.file)],
  exitOnError: false // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
// logger.stream = {
//   write: function(message, encoding) {
//     // use the 'info' log level so the output will be picked up by both transports (file and console)
//     logger.info(message);
//   }
// };

const captureArgsLogger = {
  write: (message: any) => {
    captureArgs.info(message);
  }
};

const deviceSniffingLogger = {
  write: (message: any) => {
    deviceSniffing.info(message);
  }
};

export { captureArgsLogger, deviceSniffingLogger, logger };

// logger.write()

export const stream = {
  write: (message: any) => {
    logger.info(message);
  }
};
