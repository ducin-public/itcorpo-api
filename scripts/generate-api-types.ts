import path from 'path';
import { generateApi } from 'swagger-typescript-api';
import { logger } from '../lib/logger';
import { FILES } from '../lib/files';

const generate = async (): Promise<void> => {
  try {
    await generateApi({
      name: "api.ts",
      output: path.resolve(process.cwd(), "./contract-types"),
      input: FILES.CONTRACT_FILE,
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
