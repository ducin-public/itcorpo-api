import type { SkillProbabilitySet } from './types';

export const STRATEGIC_MANAGEMENT: SkillProbabilitySet = {
  'Strategic Planning': 0.9,          // Core
  'Corporate Governance': 0.85,       // Core
  'Executive Leadership': 0.95,       // Core
  'Change Management': 0.5,          // Common
  'Mergers & Acquisitions': 0.3,     // Specialized
  'Financial Strategy': 0.6,         // Common
  'Risk Management': 0.65,           // Common
  'Stakeholder Management': 0.85,    // Core
  'Business Development': 0.55,      // Common
  'Corporate Finance': 0.45,         // Common
  'International Business': 0.35,    // Specialized
  'Crisis Management': 0.4,         // Specialized
  'Digital Strategy': 0.8,          // Core
  'Board Relations': 0.9,           // Core
  'Business Model Innovation': 0.8,  // Core
  'Strategic Partnerships': 0.8,     // Core
};

export const PRODUCT_MANAGEMENT: SkillProbabilitySet = {
  'Product Team Leadership': 0.9,    // Core
  'Project Management': 0.65,        // Common
  'Team Leadership': 0.85,          // Core
  'Performance Management': 0.6,     // Common
  'Strategic Planning': 0.45,        // Common
  'Budget Management': 0.5,          // Common
  'Resource Allocation': 0.4,        // Specialized
  'Process Improvement': 0.45,       // Common
  'Conflict Resolution': 0.55,       // Common
  'Stakeholder Communication': 0.5,  // Common
  'Decision Making': 0.8,           // Core
  'Mentoring': 0.35,                // Specialized
  'Product Roadmap': 0.9,           // Core
  'User Experience': 0.8,           // Core
  'Market Analysis': 0.8,           // Core
  'Agile Management': 0.75,         // Core
};

export const SALES: SkillProbabilitySet = {
  'Sales Strategy': 0.85,           // Core
  'Account Management': 0.8,        // Core
  'Negotiation': 0.6,              // Common
  'Client Relationship': 0.9,       // Core
  'Sales Pipeline Management': 0.5,  // Common
  'CRM Software': 0.45,             // Common
  'Market Analysis': 0.35,          // Specialized
  'Sales Forecasting': 0.4,         // Specialized
  'Contract Negotiation': 0.45,     // Common
  'Solution Selling': 0.3,          // Specialized
  'Cold Calling': 0.4,              // Common
  'Lead Generation': 0.35,          // Specialized
  'Sales Analytics': 0.25,          // Specialized
  'Value Proposition': 0.85,        // Core
  'Sales Tools': 0.6,               // Common
  'Enterprise Sales': 0.4,          // Specialized
};

export const MARKETING: SkillProbabilitySet = {
  'Digital & Social Marketing': 0.7,  // Core
  'Content Marketing': 0.5,          // Common
  'SEO/SEM': 0.35,                  // Specialized
  'Marketing Analytics': 0.4,        // Specialized
  'Brand Management': 0.45,          // Common
  'Campaign Management': 0.5,        // Common
  'Marketing Strategy': 0.85,        // Core
  'Market Research': 0.4,            // Specialized
  'Email Marketing': 0.45,           // Common
  'Marketing Automation': 0.3,       // Specialized
  'Product Marketing': 0.4,          // Specialized
  'Event Marketing': 0.35,           // Specialized
  'Public Relations': 0.4,           // Common
  'Marketing Metrics': 0.8,          // Core
  'A/B Testing': 0.6,                // Common
  'Customer Journey': 0.8,           // Core
};

export const HUMAN_RESOURCES: SkillProbabilitySet = {
  'Recruitment': 0.85,              // Core
  'Talent Management': 0.75,        // Core
  'Employee Relations': 0.8,        // Core
  'Performance Management': 0.7,    // Core
  'HR Policy': 0.6,                // Common
  'Benefits Administration': 0.45,  // Common
  'Training Programs': 0.7,        // Core
  'Professional Development': 0.65, // Common
  'Compensation Planning': 0.6,    // Common
  'HR Analytics': 0.7,             // Core
  'Employee Engagement': 0.75,     // Core
  'Succession Planning': 0.5,      // Common
  'HRIS Systems': 0.55,           // Common
  'Employment Law': 0.75,          // Core
  'Workplace Culture': 0.8,        // Core
  'Organizational Development': 0.8, // Core
};

export const FINANCE: SkillProbabilitySet = {
  'Financial Analysis': 0.85,       // Core
  'Financial Modeling': 0.8,        // Core
  'Budgeting': 0.9,                // Core
  'Financial Reporting': 0.7,       // Core
  'Cost Management': 0.65,         // Common
  'Strategic Planning': 0.8,        // Core
  'Risk Assessment': 0.65,         // Common
  'Audit': 0.45,                   // Specialized
  'Tax Planning': 0.4,             // Specialized
  'Investment Analysis': 0.45,      // Specialized
  'Cash Flow Management': 0.7,      // Core
  'ERP Systems': 0.6,              // Common
  'Internal Controls': 0.5,         // Common
  'Revenue Management': 0.8,        // Core
  'Business Intelligence': 0.75,    // Core
};

export const CUSTOMER_SUPPORT: SkillProbabilitySet = {
  'Customer Service': 0.95,         // Core
  'Problem Resolution': 0.85,       // Core
  'Technical Support': 0.65,        // Common
  'Customer Success': 0.85,         // Core
  'Ticket Management': 0.7,         // Core
  'Knowledge Base Management': 0.6, // Common
  'Service Level Management': 0.7,  // Core
  'Quality Assurance': 0.65,       // Common
  'Customer Experience': 0.8,       // Core
  'Multi-channel Support': 0.65,    // Common
  'Support Software': 0.7,          // Core
  'Support Metrics': 0.8,          // Core
  'Customer Feedback': 0.75,        // Core
  'User Training': 0.6,            // Common
  'Incident Management': 0.7,       // Core
};

export const OPERATIONS: SkillProbabilitySet = {
  'Process Optimization': 0.85,      // Core
  'Quality Management': 0.8,         // Core
  'Supply Chain': 0.7,              // Common
  'Vendor Management': 0.75,        // Core
  'Resource Planning': 0.8,         // Core
  'Operational Efficiency': 0.85,   // Core
  'Business Process Design': 0.7,   // Common
  'Six Sigma': 0.5,                // Specialized
  'Lean Management': 0.6,          // Common
  'Workflow Automation': 0.65,      // Common
  'KPI Management': 0.8,           // Core
  'Cost Optimization': 0.75,       // Core
  'Risk Management': 0.7,          // Common
  'Inventory Management': 0.6,     // Common
  'Business Continuity': 0.65,     // Common
};

export const CONSULTING: SkillProbabilitySet = {
  'Business Analysis': 0.9,         // Core
  'Requirements Gathering': 0.85,   // Core
  'Solution Design': 0.8,          // Core
  'Client Management': 0.9,        // Core
  'Strategy Consulting': 0.75,     // Core
  'Change Management': 0.8,        // Core
  'Process Analysis': 0.85,        // Core
  'Industry Research': 0.7,        // Common
  'Management Consulting': 0.75,    // Core
  'Workshop Facilitation': 0.7,    // Common
  'Business Case Development': 0.8, // Core
  'Stakeholder Management': 0.85,  // Core
  'Best Practices': 0.75,         // Core
  'Technical Writing': 0.7,       // Common
  'Consulting Methodologies': 0.65, // Common
};

export const PROJECT_MANAGEMENT: SkillProbabilitySet = {
  'Project Planning': 0.9,         // Core
  'Agile Management': 0.85,        // Core
  'Risk Management': 0.8,          // Core
  'Stakeholder Management': 0.85,  // Core
  'Budget Management': 0.8,        // Core
  'Resource Allocation': 0.75,     // Core
  'Project Scheduling': 0.85,      // Core
  'Quality Management': 0.75,      // Core
  'Scope Management': 0.8,         // Core
  'Program Management': 0.7,       // Common
  'PMO': 0.6,                     // Specialized
  'Project Tools': 0.7,           // Common
  'Change Control': 0.75,         // Core
  'Project Recovery': 0.6,        // Specialized
  'Benefits Realization': 0.65,    // Common
};

export const LEGAL_COMPLIANCE: SkillProbabilitySet = {
  'Regulatory Compliance': 0.9,    // Core
  'Risk Assessment': 0.85,        // Core
  'Policy Development': 0.8,      // Core
  'Contract Management': 0.85,    // Core
  'Data Privacy': 0.9,           // Core
  'GDPR': 0.8,                  // Core
  'Compliance Training': 0.75,   // Core
  'Audit Management': 0.8,      // Core
  'Legal Documentation': 0.75,   // Core
  'Corporate Governance': 0.7,   // Common
  'Industry Standards': 0.75,    // Core
  'Ethics & Compliance': 0.85,   // Core
  'Internal Controls': 0.7,     // Common
  'Compliance Reporting': 0.75,  // Core
  'Regulatory Change': 0.7,     // Common
};

export const MISC: SkillProbabilitySet = {
  'Business Communication': 0.45,   // Core
  'Microsoft Office': 0.45,         // Core
  'Presentation Skills': 0.45,      // Core
  'Project Management': 0.4,        // Core
  'Problem Solving': 0.4,           // Core
  'Public Speaking': 0.4,           // Core
  'Organizational Skills': 0.45,    // Core
  'Conflict Resolution': 0.35,      // Common
  'Critical Thinking': 0.45,        // Core
};

export const RECEPTION: SkillProbabilitySet = {
  'Front Desk Operations': 0.95,     // Core
  'Visitor Management': 0.9,         // Core
  'Phone System': 0.85,              // Core
  'Calendar Management': 0.8,        // Core
};

export const OFFICE_MANAGEMENT: SkillProbabilitySet = {
  'Office Administration': 0.95,     // Core
  'Facilities Management': 0.9,      // Core
  'Vendor Coordination': 0.85,       // Core
  'Budget Administration': 0.8,      // Core
};
