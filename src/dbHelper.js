const { executeQuery } = require("./dbConnection");
const { getCurrentDate } = require("./utils");

const insertQuery = async (payload, table) => {
  let result = {};
  let sql = ''
  try {
    const keys = Object.keys(payload[0]);
    sql = `INSERT INTO ${table} (${keys.join(", ")}, create_date, update_date) VALUES ?`;
    let values;
    const date = getCurrentDate();
      values = [
        payload.map((obj) => {
          const temp = [];
          keys.forEach((key) => temp.push(obj[key] || null));
          return [...temp, date, date];
        }),
      ];
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

const updateQuery = async (updateObj, table, conditionObj) => {
  let result = {};
  let sql = ''
  try {
    let updateStr = '';
    Object.keys(updateObj).forEach((key) => {
      if (updateStr) updateStr +=",";
      const str = `${key} = ${Number(updateObj[key])? updateObj[key]:  `'${updateObj[key]}'`}`
      updateStr += str;
    })

    let conditionStr = '';
    Object.keys(conditionObj).forEach((key) => {
      if (conditionStr) conditionStr +=" and ";
      const str = `${key}=${Number(conditionObj[key])? conditionObj[key]:  `'${conditionObj[key]}'`}`
      conditionStr += str;
    })
    const date = getCurrentDate();
    updateStr+=`,update_date = '${date}'`
    sql = `UPDATE ${table} SET ${updateStr} WHERE ${conditionStr}`;
    result = await executeQuery(sql);
  } catch (e) {
    console.error("ERROR IN UPDATE QUERY",sql, e)
    result.isError = true;
    result.error = e;
    result.msg = e.sqlMessage || e.message,
    result.code = e.code || "SOMETHIN WENT WRONG"
  }
  return result;
};

module.exports = {
  insertQuery, updateQuery
};
