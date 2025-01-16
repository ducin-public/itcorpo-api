
export * from './skillsets/types';
import { probability } from '../lib/math';
import { ProfileType } from './profiles';
import { profileSkillsets } from './skillsets';

export const generateSkillsForProfile = (profileType: ProfileType): string[] => {
  const skills: string[] = [];
  const skillsets = profileSkillsets[profileType];
  
  if (!skillsets) return skills;

  // For each skillset in the profile (e.g., FRONTEND: 1.0, TECH_MISC: 0.5)
  for (const skillset of skillsets) {
    
    // Get the actual skillset definition (e.g., FRONTEND skills)
    const skillDefinitions = skillset.skillset;
    const profileProbability = skillset.probability;

    // For each skill in the skillset
    for (const [skill, baseProb] of Object.entries(skillDefinitions)) {
      // Multiply skillset probability with individual skill probability
      const finalProb = profileProbability * baseProb;
      
      if (probability(finalProb)) {
        skills.push(skill);
      }
    }
  }

  return skills;
};
