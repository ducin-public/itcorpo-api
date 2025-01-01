const { generateApi } = require('swagger-typescript-api');
const path = require('path');

const logger = require('../utils/logger');

const generate = async () => {
  try {
    await generateApi({
      name: "api.ts",
      output: path.resolve(process.cwd(), "./typedef"),
      input: path.resolve(process.cwd(), "./contract/swagger.yml"),
      generateClient: false,
      generateRouteTypes: true,
      generateResponses: true,
      modular: true,
      generateUnionEnums:true,
      prettier: {
        printWidth: 80,
        tabWidth: 2,
        trailingComma: "all",
        parser: "typescript"
      }
    });
    
    logger.success('API types generated successfully');
  } catch (error) {
    logger.error('Failed to generate API types:', error.message);
    process.exit(1);
  }
};

generate();
