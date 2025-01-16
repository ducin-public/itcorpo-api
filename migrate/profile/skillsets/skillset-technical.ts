import type { SkillProbabilitySet } from './types';

export const JAVA_BACKEND: SkillProbabilitySet = {
  'Java': 0.98,                // Core
  'Scala': 0.35,               // Specialized
  'Kotlin': 0.25,              // Specialized
  'Groovy': 0.15,              // Specialized
  'Spring': 0.7,               // Core
  'Spring Boot': 0.6,          // Core
  'Hibernate': 0.6,            // Common
  'JPA': 0.65,                 // Core
  'Maven': 0.8,                // Core
  'Gradle': 0.4,               // Common
  'JUnit': 0.7,                // Core
  'Mockito': 0.6,              // Common
};

export const DOTNET_BACKEND: SkillProbabilitySet = {
  'C#': 0.95,                  // Core
  'F#': 0.2,                   // Specialized
  '.NET Core': 0.85,           // Core
  '.NET Framework': 0.7,       // Common
  'ASP.NET': 0.85,            // Core
  'EntityFramework': 0.8,      // Core
  'LINQ': 0.9,                // Core
  'WPF': 0.4,                 // Specialized
  'NUnit': 0.7,               // Common
  'xUnit': 0.5,               // Common
};

export const FRONTEND: SkillProbabilitySet = {
  'JavaScript': 0.95,          // Core
  'TypeScript': 0.8,          // Core
  'HTML': 0.95,               // Core
  'CSS': 0.9,                 // Core
  'React': 0.8,               // Core
  'Redux': 0.7,               // Common
  'Angular': 0.5,             // Common
  'Vue.js': 0.3,              // Specialized
  'RxJS': 0.4,                // Specialized
  'Webpack': 0.6,             // Common
  'Jest': 0.7,                // Common
  'Cypress': 0.5,             // Common
  'SASS/SCSS': 0.7,           // Common
  'Responsive Design': 0.8,    // Core
  'Web Performance': 0.6,      // Common
};

export const QA: SkillProbabilitySet = {
  'Selenium': 0.8,
  'JUnit': 0.7,
  'TestNG': 0.5,
  'Cucumber': 0.5,
  'Postman': 0.8,
  'JMeter': 0.6,
};

export const MOBILE: SkillProbabilitySet = {
  'Android': 0.85,
  'Kotlin': 0.8,
  'iOS': 0.8,
  'Swift': 0.75,
  'React Native': 0.6,
  'Flutter': 0.4,
};

export const DB: SkillProbabilitySet = {
  'PostgreSQL': 0.7,           // Core
  'MySQL': 0.7,               // Core
  'Oracle': 0.5,              // Common
  'SQL Server': 0.6,          // Common
  'MongoDB': 0.5,             // Common
  'Redis': 0.5,               // Common
  'Elasticsearch': 0.4,       // Specialized
  'Cassandra': 0.3,           // Specialized
};

export const ARCH: SkillProbabilitySet = {
  'System Design': 0.9,      // Core
  'Microservices': 0.85,    // Core
  'DDD': 0.6,               // Common
  'SOA': 0.5,               // Common
  'REST': 0.9,              // Core
  'gRPC': 0.4,              // Specialized
  'Event-Driven': 0.6,      // Common
  'CQRS': 0.4,              // Specialized
  'Cloud Architecture': 0.7, // Common
  'Scalability': 0.8,       // Core
  'Security': 0.8,          // Core
  'Performance': 0.8,       // Core
  'API Design': 0.85,       // Core
  'System Integration': 0.7, // Common
};

export const TECH_MISC: SkillProbabilitySet = {
  'Data Structures': 0.8,    // Core
  'Algorithms': 0.8,         // Core
  'Design Patterns': 0.8,    // Core
  'Clean Code': 0.85,        // Core
  'Agile': 0.9,             // Core
  'Scrum': 0.85,            // Core
  'Kanban': 0.7,            // Common
  'TDD': 0.7,               // Common
  'Code Review': 0.9,        // Core
  'Documentation': 0.8,      // Core
  'Problem Solving': 0.9,    // Core
  'Debugging': 0.9,         // Core
  'Mentoring': 0.6,         // Common
  'Technical Writing': 0.6,  // Common
  'Team Collaboration': 0.9, // Core
};

export const PERFORMANCE: SkillProbabilitySet = {
  'JMeter': 0.9,                 // Core
  'LoadRunner': 0.7,             // Common
  'K6': 0.65,                    // Common
  'Gatling': 0.6,               // Common
  'Performance Tuning': 0.85,    // Core
  'Load Testing': 0.85,          // Core
  'Stress Testing': 0.8,         // Core
  'Database Performance': 0.7,    // Common
  'APM Tools': 0.75,             // Common
  'Performance Profiling': 0.8,   // Core
};

export const DEVOPS: SkillProbabilitySet = {
  'Docker': 0.85,                // Core
  'Kubernetes': 0.8,             // Core
  'Jenkins': 0.8,                // Core
  'GitLab CI': 0.7,             // Common
  'GitHub Actions': 0.7,         // Common
  'AWS': 0.8,                   // Core
  'Azure': 0.7,                 // Common
  'Terraform': 0.75,            // Core
  'Ansible': 0.6,               // Common
  'Prometheus': 0.7,            // Common
  'Grafana': 0.7,               // Common
  'ELK Stack': 0.6,             // Common
  'Infrastructure as Code': 0.8, // Core
};

export const SECURITY: SkillProbabilitySet = {
  'OAuth 2.0': 0.75,             // Core
  'OpenID Connect': 0.75,        // Core
  'SSL/TLS': 0.7,               // Core
  'JWT': 0.8,                   // Core
  'SAML': 0.6,                  // Common
  'Keycloak': 0.6,              // Common
  'Penetration Testing': 0.7,    // Specialized
  'OWASP Security': 0.75,       // Core
  'Security Monitoring': 0.7,    // Common
  'WAF': 0.6,                   // Specialized
  'Vulnerability Assessment': 0.7, // Common
};

export const FUNCTIONAL_QA: SkillProbabilitySet = {
  'Test Planning': 0.9,           // Core
  'Test Cases Design': 0.9,       // Core
  'Bug Tracking': 0.85,           // Core
  'Test Management': 0.8,         // Core
  'Agile Testing': 0.85,          // Core
  'Regression Testing': 0.8,      // Core
  'Integration Testing': 0.75,    // Common
  'User Acceptance': 0.7,         // Common
  'API Testing': 0.7,             // Common
  'Mobile Testing': 0.6,          // Common
  'Cross-browser Testing': 0.65,  // Common
  'Test Documentation': 0.8,      // Core
  'Requirements Analysis': 0.85,   // Core
  'Risk Assessment': 0.7,         // Common
  'Quality Metrics': 0.75,        // Common
};

export const AUTOMATION_QA: SkillProbabilitySet = {
  'Selenium': 0.9,                // Core
  'Cypress': 0.8,                 // Core
  'TestNG': 0.75,                // Common
  'JUnit': 0.75,                 // Common
  'Cucumber': 0.7,               // Common
  'Robot Framework': 0.6,        // Common
  'Playwright': 0.65,            // Common
  'Test Automation': 0.9,        // Core
  'CI/CD Testing': 0.8,          // Core
  'API Automation': 0.85,        // Core
  'Mobile Automation': 0.7,      // Common
  'Python Testing': 0.7,         // Common
  'JavaScript Testing': 0.75,    // Common
  'Test Framework Design': 0.8,  // Core
  'Version Control': 0.85,       // Core
};

export const SECURITY_QA: SkillProbabilitySet = {
  'Security Testing': 0.9,       // Core
  'Penetration Testing': 0.8,    // Core
  'OWASP': 0.85,                // Core
  'Vulnerability Testing': 0.85, // Core
  'Security Scanning': 0.8,      // Core
  'SAST Tools': 0.75,           // Common
  'DAST Tools': 0.75,           // Common
  'API Security': 0.8,          // Core
  'Authentication Testing': 0.85,// Core
  'Authorization Testing': 0.85, // Core
  'Encryption Testing': 0.7,    // Common
  'Security Standards': 0.75,   // Common
  'Risk Assessment': 0.8,       // Core
  'Security Reports': 0.75,     // Common
  'Compliance Testing': 0.7,    // Common
};
