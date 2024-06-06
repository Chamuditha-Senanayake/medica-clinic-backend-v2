export default function transformMediaResponse(currentResponse) {
  const groupedByIndex = {};
  currentResponse.forEach(record => {
    if (!groupedByIndex[record.Id]) {
      const { FileId, Path, FileType, ...restOfRecord } = record;

      groupedByIndex[record.Id] = {
        ...restOfRecord,
        Files: [],
      };
    }
    if (record.FileId != null) {
      groupedByIndex[record.Id].Files.push({
        Id: record.FileId,
        Path: record.Path,
        FileType: record.FileType,
      });
    }
  });

  const transformedData = Object.values(groupedByIndex);

  return transformedData.reverse();
}
