export const deHashPatientId = ({ patientId }) => {
  if (typeof patientId !== "string") {
    patientId = `${patientId}`;
  }
  let Result = patientId.substring(4);
  let PatientId = Result.slice(0, -2);
  return PatientId;
};

export const deHashId = ({ Id }) => {
  if (typeof Id !== "string") {
    Id = `${Id}`;
  }
  let Result = Id.substring(4);
  let PatientId = Result.slice(0, -2);
  return PatientId;
};
