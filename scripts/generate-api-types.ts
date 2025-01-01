import { generateApi } from 'swagger-typescript-api';
import path from 'path';
import logger from '../utils/logger';

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
    
    logger.success('API types generated successfully');
  } catch (error) {
    logger.error('Failed to generate API types:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};

generate();
