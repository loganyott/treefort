import winston from 'winston';

winston.level = process.env.LOG_LEVEL || 'debug';
const methods = new Set(['get', 'update', 'create', 'delete']);

const winstonLogDecorator = Controller => (dynamo, dbStage, wave = null) => {
  // eslint-disable-next-line
  winston.log('debug', `dynamo: ${dynamo}, dbStage: ${dbStage}, wave: ${wave}`);

  const controller = new Controller(dynamo, dbStage, wave);

  // Turns out that es6 class methods are not immediately enumerable. This is why getOwnPropertyNames is required
  // eslint-disable-next-line
  Object.getOwnPropertyNames(Controller.prototype).forEach(property => {
    if (
      typeof Controller.prototype[property] === 'function' &&
      methods.has(property)
    ) {
      const originalMethod = Controller.prototype[property];
      // eslint-disable-next-line
      controller[property] = function(...args) {
        const originalReturnValue = originalMethod.call(this, ...args);
        winston.log(
          'debug',
          `${Controller.name}#${property}(${[...args].join(
            ','
          )}) returned ${JSON.stringify(originalReturnValue, null, 2)}`
        );

        return originalReturnValue;
      };
    }
  });

  return controller;
};

export default winstonLogDecorator;
