import chalk from 'chalk';
import { profiles } from './profiles';
import { generateSkillsForProfile } from './profile-to-skills';
import { departmentForAProfile } from './profile-to-department';
import { engineeringPerOfficeCount } from './country-employee-count';
import { jobTitle } from './profile-to-title';

console.log(chalk.blue.bold('\nGenerating office engineering count...\n'));

console.log(engineeringPerOfficeCount);

console.log(chalk.blue.bold('\nGenerating employee profiles...\n'));

// Generate and display skills for each profile type
for (const profileType of profiles) {
  console.log(chalk.blue(`\n=== ${profileType} (${jobTitle(profileType)}) === `));
  
  const skills = generateSkillsForProfile(profileType);
  const department = departmentForAProfile(profileType);

  console.log(chalk.yellow(`Department: ${department?.name}`));

  for (const skill of skills) {
    console.log(chalk.green(`- ${skill}`));
  }
  
  console.log(chalk.gray(`Total skills: ${skills.length}`));
}

console.log(chalk.blue.bold('\nDone generating profiles.\n'));
