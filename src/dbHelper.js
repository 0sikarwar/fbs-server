const { executeQuery } = require("./dbConnection");
const { getCurrentDate } = require("./utils");

const insertQuery = async (payload, table, isMulti) => {
  let result = {};
  let sql = ''
  try {
    const keys = Object.keys(isMulti ? payload[0] : payload);
    sql = `INSERT INTO ${table} (${keys.join(", ")}, create_date, update_date) VALUES ?`;
    let values;
    const date = getCurrentDate();
    if (isMulti) {
      values = [
        payload.map((obj) => {
          const temp = [];
          keys.forEach((key) => temp.push(obj[key] || null));
          return [...temp, date, date];
        }),
      ];
    }
    console.log({ sql, values });
    result = await executeQuery(sql, values);
  } catch (e) {
    console.error("ERROR IN INSERT QUERY",sql, e)
    result.isError = true;
    result.error = e;
    result.msg = e.sqlMessage || e.message,
    result.code = e.code || "SOMETHIN WENT WRONG"
  }
  return result;
};

module.exports = {
  insertQuery,
};
