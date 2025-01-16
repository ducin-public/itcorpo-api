import { randomFromArray, weightedRandom } from '../lib/random'
import { ProfileType } from './profiles'

const randomExpPhrase = weightedRandom({
  'Just a': 0.10,
  Junior: 0.20,
  '': 0.35,
  Senior: 0.30,
  Principal: 0.05
})

export const phrases_TECH: {
    [profile in Extract<ProfileType, `ENGINEERING_${string}`>]: string[]
} = {
    ENGINEERING_FRONTEND: [randomExpPhrase(), randomFromArray(['JavaScript', 'Frontend', 'UI']), randomFromArray(['Engineer', 'Developer', 'Programmer'])],
    ENGINEERING_BACKEND: [randomExpPhrase(), randomFromArray(['Java', '.NET', 'Backend']), randomFromArray(['Engineer', 'Developer', 'Programmer'])],
    ENGINEERING_MOBILE: [randomExpPhrase(), randomFromArray(['Mobile', 'iOS', 'Android']), randomFromArray(['Engineer', 'Developer', 'Programmer'])],
    ENGINEERING_QA: [randomExpPhrase(), randomFromArray(['QA Engineer', 'Tester'])],
    ENGINEERING_DEVSECOPS: [randomExpPhrase(), randomFromArray(['DevOps', 'DevSecOps', 'Cloud']), randomFromArray(['Engineer', 'Specialist'])],
    ENGINEERING_RECEPTIONIST: ['Receptionist'],
    ENGINEERING_OFFICE_MANAGER: ['Office Manager'],
}

type TECH_PROFILE =
  | 'ENGINEERING_FRONTEND'
  | 'ENGINEERING_BACKEND'
  | 'ENGINEERING_MOBILE'
  | 'ENGINEERING_QA'
  | 'ENGINEERING_DEVSECOPS'
  | 'ENGINEERING_RECEPTIONIST'
  | 'ENGINEERING_OFFICE_MANAGER'

const join = (arr: string[]) => arr.filter(i => i.length).join(' ')

const techJobTitleGen = (profile: TECH_PROFILE) => {    
  return join(phrases_TECH[profile])
}

export const JobTitles_NONTECH: {
    [profile in Exclude<ProfileType, `ENGINEERING_${string}`>]: string[]
} = {
  STRATEGIC_MANAGEMENT: [
    'Chief Executive Officer',
    'Chief Financial Officer',
    'Chief Information Officer',
    'Chief Technology Officer',
    'Chief Security Officer',
    'Chief Marketing Officer',
  ],
  PRODUCT_MANAGEMENT: [
    'Manager',
    'Senior Manager',
    'Director',
    'Senior Director',
    'Head of Department',
  ],
  // https://www.thebalancecareers.com/sales-job-titles-2061545
  SALES: [
    'Account Executives',
    'Account Manager',
    'Account Representative',
    'Advertising Sales Representative',
    'Area Sales Manager',
    'Automotive Sales Representative',
    'B2B Corporate Sales',
    'Brand Ambassador',
    'Business Development Manager',
    'Business Development Representative',
    'Channel Partner Sales Executive',
    'Corporate Sales Account Executive',
    'Customer Care Representative',
    'Direct Sales Manager',
    'Direct Salesperson',
    'Director of Inside Sales',
    'Director of National Sales',
    'Director of Sales',
    'Distribution Sales Representative',
    'District Sales Manager',
    'Enterprise Resources Planning Representative',
    'Enterprise Sales Representative',
    'Equipment Sales Specialist',
    'Executive Vice President, Sales',
    'Financial Advisor',
    'Financial Planner',
    'Financial Sales Assistant',
    'Fixed Income Specialist',
    'Franchise Development Manager',
    'Group and Events Sales Coordinator',
    'Group Sales Manager',
    'Healthcare Sales Representative',
    'Industrial Sales Representative',
    'Industry Representative',
    'Inside Sales Manager',
    'Inside Salesperson',
    'Insurance Sales Representative',
    'Investments Representative',
    'Key Account Manager',
    'Major Accounts Manager',
    'Manager, Business Development',
    'Market Development Manager',
    'Medical Sales Representative',
    'National Accounts Sales Analyst',
    'National Accounts Sales General Manager',
    'National Accounts Sales Representative',
    'National Sales Manager',
    'Outside Sales Representative',
    'Regional Dealer Recruiter',
    'Regional Sales Account Manager',
    'Regional Sales Executive',
    'Regional Sales Manager',
    'Retail Sales Representative',
    'Retail Store Manager',
    'Route Sales Representative',
    'Sales Account Executive, Small and Medium Business',
    'Sales and Community Marketing Manager',
    'Sales Assistant',
    'Sales Associate',
    'Sales Coordinator',
    'Sales Director',
    'Sales Manager',
    'Sales Operation Coordinator',
    'Sales Representative',
    'Sales Representative - Territory Lead',
    'Sales Trainee',
    'Salesperson',
    'Specialty Sales Representative',
    'Strategic Account Manager',
    'Territory Business Manager',
    'Territory Manager',
    'Territory Sales Manager',
    'Territory Sales Representative',
    'Wealth Management Advisor',
    'Wholesale Sales Manager',
  ],
  // https://www.indeed.com/q-Payroll-Title-jobs.html
  FINANCE: [
    'Payroll Specialist',
    'Payroll Senior Specialist',
    'Payroll Analyst',
    'Payroll Senior Analyst',
    'Payroll Accountant',
    'Payroll Senior Accountant',
    'Payroll Manager',
    'Payroll Systems Administrator',
    'Payroll Supervisor',
    'Benefits and Payroll Administrator',
    'Payroll and Benefits Coordinator',
    'Payroll Assistant',
    'Payroll Auditor',
    'Accountant',
    'Budget Analyst',
    'Budget Manager',
    'Corporate Accountant',
    'Financial Analyst',
    'Internal Auditor',
    'Industrial Accountant',
    'Revenue Cycle Administrator',
    'Revenue Cycle Manager',
    'Staff Accountant',
    'Staff Auditor',
    'Tax Accountant',
    'Tax Specialist',
  ],
  // https://www.thebalancecareers.com/marketing-job-titles-2061535
  MARKETING: [
    'Content Marketing Manager',
    'Content Writer',
    'Digital Marketing Manager',
    'Internet Marketing Specialist',
    'SEO Manager',
    'Social Media Marketing Analyst ',
    'Social Media Marketing Coordinator ',
    'Social Media Marketing Manager',
    'eCommerce Marketing Director',
    'eCommerce Marketing Manager',
    'eCommerce Marketing Specialist',
    'Email Marketer',
    'Online Product Manager',
    'Assistant Brand Manager',
    'Assistant Product Manager',
    'Associate Brand Manager',
    'Brand Assistant',
    'Brand Manager',
    'Brand Strategist',
    'Senior Product Manager',
    'Product Manager',
    'Product Marketing Manager',
    'Senior Brand Manager',
    'Market Research Analyst',
    'Market Research Assistant',
    'Marketing Analyst',
    'Marketing Data Analyst',
  ],
  // https://www.thebalancecareers.com/accounting-job-titles-2061488
  RESEARCH_AND_DEVELOPMENT: [
    'Innovation Research Scientist',
    'Advanced Technology Researcher',
    'Emerging Tech Research Lead',
    'R&D Solutions Architect',
    'Principal Research Engineer',
    'Technology Innovation Director',
    'Research & Innovation Strategist',
    'Chief Research Officer',
    'AI Research Scientist',
    'Machine Learning Research Engineer',
    'Quantum Computing Researcher',
    'Blockchain Research Specialist',
    'Data Science Research Lead',
    'Cloud Computing Researcher',
    'IoT Research Engineer',
    'Computer Vision Scientist',
    'Natural Language Processing Researcher',
    'Robotics Research Engineer',
    'Advanced Materials Researcher',
    'Digital Innovation Specialist',
  ],
  HUMAN_RESOURCES: [
    'Recruitment Specialist',
    'Recruitment Manager',
    'Employee Relations Specialist',
    'Retention Specialist',
    'Retention Strategist',
    'Benefits Specialist',
    'Staff Coordinator',
  ],
  CUSTOMER_SUPPORT: [
    'Desktop Analyst',
    'Help Desk Specialist',
    'Infrastructure Support Analyst',
    'Deskside Support Specjalist',
    'Customer Support Specialist',
    'Multilingual Customer Support Specialist',
    'Customer Success Associate',
    'Customer Service Engineer',
    'Customer Service Supervisor',
    'Customer Service Manager',
    'Customer Service Representative',
    'Remote Customer Service Representative',
  ],
  // https://www.thebalancecareers.com/list-of-information-technology-it-job-titles-2061498
}

const nontechJobTitleGen = (profile: Exclude<ProfileType, `ENGINEERING_${string}`>) => {
  return randomFromArray(JobTitles_NONTECH[profile])
}

export const jobTitle = (profile: ProfileType) => {
    if (profile.startsWith('ENGINEERING')) {
        return techJobTitleGen(profile as any)
    } else {
        return nontechJobTitleGen(profile as any)
    }
}
