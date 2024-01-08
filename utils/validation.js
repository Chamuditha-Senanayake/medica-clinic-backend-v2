import all from "mssql";
const { Int } = all;

class Validation {
  static number({ name, value }) {
    if (!value) throw new Error(`${name} is required`);
    if (typeof value !== "number") throw new Error(`${name} must be a number`);
  }

  static fieldName({ name }) {
    if (!name) throw new Error(`Field name is required`);
    if (typeof name !== "string")
      throw new Error(`Field name must be a string`);
  }

  static intNumber = ({ name, value }) => {
    this.number({ name, value });
    if (!Number.isInteger(value)) throw new Error(`${name} must be an integer`);
  };

  static unsignedIntNumber = ({ name, value }) => {
    this.intNumber({ name, value });
    if (value < 0) throw new Error(`${name} must be a positive number`);
  };

  static entityId({ name, value }) {
    this.unsignedIntNumber({ name, value });
  }

  static stringValue = ({ name, value }) => {
    this.fieldName({ name });
    if (typeof value !== "string") throw new Error(`${name} must be a string`);
  };
}

export default Validation;
