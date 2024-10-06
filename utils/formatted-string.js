const formattedString = ({ format, args = [] }) => {
  return format.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != "undefined" ? args[number] : match;
  });
};

export default formattedString;
