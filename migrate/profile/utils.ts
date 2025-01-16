import { probability } from '../lib/math';
import { randomFromArray } from '../lib/random';
import { allSkills, techSkillSets, businessSkillSets } from './profile';

/**
 * Generates a random set of skills for an employee based on their department
 */
const randomSkillSet = (): string[] =>
  randomFromArray(probability(0.05) ? businessSkillSets : techSkillSets);

/**
 * Maps a skill set to actual skills with probability checks
 */
const skillsFor = (skillSet: Record<string, number>): string[] =>
  Object.entries(skillSet)
    .map(([skill, prob]) => [skill, probability(prob)] as [string, boolean])
    .filter(([, included]) => included)
    .map(([name]) => name);

/**
 * Generates a random set of skills for an employee based on their department
 * @param skills Record of skill sets with their probabilities
 * @returns Array of randomly selected skills based on probabilities
 */
export const generateSkills = (
  skills: Record<string, Record<string, Record<string, number>>>
): string[] => {
  const skillsLists = randomSkillSet()
    .map(skillSetName => skillsFor(skills[skillSetName][skillSetName]));
  return skillsLists.reduce<string[]>((all, sublist) => [...all, ...sublist], []);
};

// Skill querying helpers
export const skillsInclude = (includedSkill: string) =>
  (skills: string[]) => skills.includes(includedSkill);

export const skillsAreNot = (excludedSkill: string) =>
  (skills: string[]) => !skills.includes(excludedSkill);

const notManagement = skillsAreNot('management');
const notRecruitment = skillsAreNot('recruitment');
const notPayroll = skillsAreNot('payroll');
const notSales = skillsAreNot('sales');

export const skillsAreTech = (skills: string[]) =>
  notManagement(skills) && 
  notRecruitment(skills) && 
  notPayroll(skills) && 
  notSales(skills);
