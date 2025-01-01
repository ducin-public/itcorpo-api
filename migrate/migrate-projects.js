const logger = require("../utils/logger");

const domainPrefixes = [
    'Smart', 'Intelligent', 'Auto', 'Digital', 'Cyber', 'Neural', 'Cloud', 
    'Quantum', 'Data', 'AI', 'ML', 'Secure', 'Connected', 'Virtual', 'Edge',
    'Blockchain', 'IoT', 'Mobile', 'Enterprise', 'Hybrid'
];

const industryDomains = [
    'Health', 'Med', 'Car', 'Vehicle', 'Bank', 'Finance', 'Research', 
    'Analytics', 'Security', 'Payment', 'Learning', 'Diagnostic', 'Trading',
    'Manufacturing', 'Robotics', 'Authentication', 'Supply'
];

const projectTypes = [
    'Platform', 'System', 'Hub', 'Framework', 'Engine', 'Portal', 'Suite',
    'Network', 'Solution', 'Interface', 'Core', 'Module', 'Service', 'API',
    'Analytics', 'Chain', 'Assistant'
];

const fancyPrefixes = [
    'Next-Gen', 'Ultra', 'Future', 'Meta', 'Omega', 'Prime', 'Advanced',
    'Revolutionary', 'Dynamic', 'Quantum-Edge'
];

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

const generateNewProjectName = () => {
    // First generate base name parts
    const getBaseParts = () => {
        const patterns = [
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

    // Then apply formatting
    const nameParts = getBaseParts();
    const formatStyle = Math.random();

    if (formatStyle < 0.6) {
        // Space-separated (60% chance)
        return nameParts.join(' ');
    } else if (formatStyle < 0.8) {
        // Concatenated (20% chance)
        return nameParts.join('');
    } else {
        // Fancy version (20% chance)
        const fancyOptions = [
            () => `${getRandomElement(fancyPrefixes)} ${nameParts.join(' ')}`,
            () => `Project ${nameParts.join(' ')}`,
            () => `${nameParts.join('-')} ${getRandomElement(['2.0', 'Pro', 'Enterprise', 'X'])}`,
            () => `[${getRandomElement(fancyPrefixes)}] ${nameParts.join(' ')}`
        ];
        return getRandomElement(fancyOptions)();
    }
};

const migrateProjects = (projects) => {
    logger.info(`Found ${projects.length} projects to process`);
    return projects.map(project => ({
        ...project,
        name: generateNewProjectName()
    }));
};

module.exports = {
    migrateProjects
};
