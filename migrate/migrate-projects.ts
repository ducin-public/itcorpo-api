import { logger } from '../lib/logger';
import { Project } from './types';

const domainPrefixes: string[] = [
    'Smart', 'Intelligent', 'Auto', 'Digital', 'Cyber', 'Neural', 'Cloud', 
    'Quantum', 'Data', 'AI', 'ML', 'Secure', 'Connected', 'Virtual', 'Edge',
    'Blockchain', 'IoT', 'Mobile', 'Enterprise', 'Hybrid'
];

const industryDomains: string[] = [
    'Health', 'Med', 'Car', 'Vehicle', 'Bank', 'Finance', 'Research', 
    'Analytics', 'Security', 'Payment', 'Learning', 'Diagnostic', 'Trading',
    'Manufacturing', 'Robotics', 'Authentication', 'Supply'
];

const projectTypes: string[] = [
    'Platform', 'System', 'Hub', 'Framework', 'Engine', 'Portal', 'Suite',
    'Network', 'Solution', 'Interface', 'Core', 'Module', 'Service', 'API',
    'Analytics', 'Chain', 'Assistant'
];

const fancyPrefixes: string[] = [
    'Next-Gen', 'Ultra', 'Future', 'Meta', 'Omega', 'Prime', 'Advanced',
    'Revolutionary', 'Dynamic', 'Quantum-Edge'
];

const getRandomElement = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

const generateNewProjectName = (): string => {
    type PatternFunction = () => string[];
    type WeightedPattern = [number, PatternFunction];

    const getBaseParts = (): string[] => {
        const patterns: WeightedPattern[] = [
            [0.4, () => [getRandomElement(domainPrefixes), getRandomElement(industryDomains)]],
            [0.3, () => [getRandomElement(domainPrefixes), getRandomElement(industryDomains), getRandomElement(projectTypes)]],
            [0.2, () => [getRandomElement(industryDomains), getRandomElement(projectTypes)]],
            [0.1, () => [getRandomElement(domainPrefixes), getRandomElement(projectTypes)]]
        ];

        const randomValue = Math.random();
        let weightSum = 0;
        
        for (const [weight, patternFn] of patterns) {
            weightSum += weight;
            if (randomValue <= weightSum) {
                return patternFn();
            }
        }
        
        return patterns[0][1]();
    };

    const nameParts = getBaseParts();
    const formatStyle = Math.random();

    if (formatStyle < 0.6) {
        return nameParts.join(' ');
    } else if (formatStyle < 0.8) {
        return nameParts.join('');
    } else {
        const fancyOptions: (() => string)[] = [
            () => `${getRandomElement(fancyPrefixes)} ${nameParts.join(' ')}`,
            () => `Project ${nameParts.join(' ')}`,
            () => `${nameParts.join('-')} ${getRandomElement(['2.0', 'Pro', 'Enterprise', 'X'])}`,
            () => `[${getRandomElement(fancyPrefixes)}] ${nameParts.join(' ')}`
        ];
        return getRandomElement(fancyOptions)();
    }
};

export const migrateProjects = (projects: Project[]): Project[] => {
    logger.info(`Found ${projects.length} projects to process`);
    return projects.map(project => ({
        ...project,
        name: generateNewProjectName()
    }));
};
