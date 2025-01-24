export const stripOfficeCoordinates = <T extends { coordinates: unknown; }>(office: T) => {
    const { coordinates, ...strippedOffice } = office;
    return strippedOffice;
}
