let mysql = require("mysql");
let config = require("./dbConfig.json");

var mysqlPool = mysql.createPool(config);

function getConnection(callback) {
  mysqlPool.getConnection(function (err, conn) {
    if (err) {
      console.log("ERORRRRRRRRRR", err);
      return;
    }
    callback && callback(err, conn);
  });
}
async function executeQuery(sql, values) {
  const result = await new Promise((resolve, reject) => {
    mysqlPool.getConnection((err, conn) => {
      if (err) {
        reject(queryErr);
      }
      conn.query(sql, values, (queryErr, result) => {
        if (queryErr) {
          reject(queryErr);
        }
        resolve(result);
      });
      conn.release();
    });
  });
  return result;
}

module.exports = {
  getConnection,
  executeQuery,
};
