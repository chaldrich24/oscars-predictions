export const getPosterFileName = (nominee: string) => {
    const cleaned = nominee
      .toLowerCase()
      .replace(/[:\/\\|?<>*"']/g, "") // Remove special characters that are not allowed in file names
      .replace(/\s+/g, "_"); // Replace spaces with underscores
    return `${cleaned}.jpg`;
}   