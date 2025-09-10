export const teamSizeToInt = <T, U>(withTeam: T & { team: U[] }) => {
    const { team, ...rest } = withTeam
    const withTeamSize = {
        ...rest,
        teamSize: team.length
    }
    return withTeamSize;
}
