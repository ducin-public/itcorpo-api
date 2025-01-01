import path from 'path';
import { generateApi } from 'swagger-typescript-api';
import { logger } from '../lib/logger';

const generate = async (): Promise<void> => {
  try {
    await generateApi({
      name: "api.ts",
      output: path.resolve(process.cwd(), "./typedef"),
      input: path.resolve(process.cwd(), "./contract/swagger.yml"),
      generateClient: false,
      generateRouteTypes: true,
      generateResponses: true,
      modular: true,
      generateUnionEnums: true,
      prettier: {
        printWidth: 80,
        tabWidth: 2,
        trailingComma: "all",
        parser: "typescript"
      }
    });
    
    logger.info('API types generated successfully');
  } catch (error) {
    logger.error('Failed to generate API types:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};

generate();
