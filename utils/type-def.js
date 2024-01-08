import Validation from "./validation.js";
import sql from "mssql";
const {
  Int,
  NVarChar,
  VarChar,
  TinyInt,
  Bit,
  Float,
  Decimal,
  Date,
  DateTime,
  Binary,
} = sql;

/**
 * Generates a parameter object for entty id (integer) primary key or foreign key
 * @returns {object} - parameter object
 */
export const EntityId = ({ fieldName, value }) => {
  Validation.fieldName({ name: fieldName });
  Validation.entityId({ name: fieldName, value });
  return {
    name: fieldName,
    type: Int,
    value,
  };
};

/**
 * Generates a parameter object for always positive integer field. Eg. Age, Height, Appointment number
 * @returns {object} - parameter object
 */
export const UnsignedInteger = ({ fieldName, value }) => {
  Validation.fieldName({ name: fieldName });
  Validation.unsignedIntNumber({ name: fieldName, value });
  return {
    name: fieldName,
    type: Int,
    value,
  };
};

/**
 * Generates a parameter object for general integer field (Could be negative or positive number). Eg. temperature, weight, etc.
 * @returns {object} - parameter object
 */
export const SignedInteger = ({ fieldName, value }) => {
  Validation.fieldName({ name: fieldName });
  Validation.intNumber({ name: fieldName, value });
  return {
    name: fieldName,
    type: Int,
    value,
  };
};

/**
 * Generates a parameter object for string field.
 * @returns {object} - parameter object
 */
export const StringValue = ({ fieldName, value }) => {
  Validation.fieldName({ name: fieldName });
  Validation.stringValue({ name: fieldName, value });
  return {
    name: fieldName,
    type: NVarChar,
    value,
  };
};
