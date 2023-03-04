module.exports = function (wallaby) {
    return {
      //autoDetect: true,
      files: [
        'service_worker/**/*.ts',
        { pattern: 'service_worker/**/*.spec.ts', ignore: true }
      ],
  
      tests: [
        'service_worker/**/*.spec.ts'
      ],
  
      //testFramework: 'vitest'
    };
  };