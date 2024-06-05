export default function transformCurrentResponse(currentResponse) {
  const groupedByIndex = {};
  currentResponse.forEach(record => {
    if (!groupedByIndex[record.Id]) {
      groupedByIndex[record.Id] = {
        ...record,
        Files: [],
      };
    }
    groupedByIndex[record.Id].Files.push({
      Id: 'record.FileId',
      Path: 'record.Path',
      FileType: 'record.FileType',
    });
  });

  const transformedData = Object.values(groupedByIndex);

  return transformedData;
}

// const transformResponse = response => {
//   const transformedData = [];

//   response.forEach(row => {
//     const record = {
//       Id: row.Id,
//       UserId: row.UserId,
//       DoctorUserId: row.DoctorUserId,
//       DoctorName: row.DoctorName,
//       RecordType: row.RecordType,
//       BodyPart: row.BodyPart,
//       SubBodyPart: row.SubBodyPart,
//       SubBodyPartType: row.SubBodyPartType,
//       Date: row.Date,
//       Diagnosis: row.Diagnosis,
//       Symptoms: row.Symptoms,
//       Notes: row.Notes,
//       UserSaved: row.UserSaved,
//       Files: [],
//     };

//     if (row.Id && row.Path && row.FileType) {
//       record.Files.push({
//         Id: row.Id,
//         Path: row.Path,
//         FileType: row.FileType,
//       });
//     }

//     transformedData.push(record);

//     return transformedData;
//   });
// };

// // Applying the transformation
// const transformedResponse = transformResponse(responseObject);

// console.log(transformedResponse);
