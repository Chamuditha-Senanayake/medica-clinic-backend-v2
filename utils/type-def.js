import { StandardValidation } from "express-validator/src/context-items/standard-validation.js";
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
  TVP,
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

export const DateString = ({ fieldName, value }) => {
  Validation.fieldName({ name: fieldName });
  Validation.stringValue({ name: fieldName, value });
  return {
    name: fieldName,
    type: DateTime,
    value,
  };
};

export const FloatValue = ({ fieldName, value }) => {
  Validation.fieldName({ name: fieldName });
  Validation.floatValue({ name: fieldName, value });
  return {
    name: fieldName,
    type: Float,
    value,
  };
};

export const DecimalValue = ({ fieldName, value }) => {
  Validation.fieldName({ name: fieldName });
  Validation.decimalValue({ name: fieldName, value });
  return {
    name: fieldName,
    type: Decimal,
    value,
  };
};

/**
 *
 * @param {tableName} string
 * @param {columns} array of objects [ { columnName, type, options } ]
 * @returns
 */
export const TableValueParameters = ({ tableName, columns, values }) => {
  // note that the mssql package does not currently support retrieving User Defined Types directly.
  // create the new table
  // this will not create a table in mssql database, it will create a instance in the memory instead
  let table = new sql.Table(tableName);

  // adding columns
  columns.forEach(({ columnName, type, options }) => {
    if (options) {
      table.columns.add(columnName, type, options);
    } else {
      table.columns.add(columnName, type);
    }
  });

  /**
   * [
   *  { fieldName, value, type, options },
   *  { fieldName, value, type, options },
   *  { fieldName, value, type, options },
   *  ] = ContacNumbers
   */

  /**
   * [45666, '076610850', 0]
   */

  /**
   * [
    {
      "Id": null,
      "Number": "0766364303",
      "Status": 0
    },
     {
      "Id": null,
      "Number": "0766364303",
      "Status": 0
    },
     {
      "Id": null,
      "Number": "0766364303",
      "Status": 0
    }
  ]
   */

  /**
   * [
   *  [null, "0766364303", 0],
   *  [null, "0766364303", 0],
   *  [null, "0766364303", 0],
   * ]
   */

   values.map((value) => {
      table.rows.add(...value);
    });
      
  return {
    name: tableName,
    type: sql.TVP(table),
    value: table,
  };
};
