export const getCountryByMobileNumber = ({ mobileNumber = "" }) => {
    let country = "LK";
    if (mobileNumber.substring(0, 2) === "94") {
      country = "SL";
    } else if (mobileNumber.substring(0, 3) === "880") {
      country = "BD"; //bangladesh
    } else if (mobileNumber.substring(0, 3) === "974") {
      country = "QA"; //qatar
    } else if (
      mobileNumber.substring(0, 2) === "60" ||
      mobileNumber.substring(0, 2) === "61"
    ) {
      country = "MY"; //qatar
    }
    return country;
  };