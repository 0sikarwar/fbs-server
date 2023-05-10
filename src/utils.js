const getCurrentDate = () => {
  return new Date().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'})
}

function sendJsonResp(res, data = {}, status = 200, header = {}) {
  const responseHeader = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Request-Method": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    ...header,
  };
  res.writeHead(status, responseHeader);
  res.write(JSON.stringify(data));
  res.end();
}
function handleErr(err, res, status) {
  console.error(err);
  sendJsonResp(
    res,
    { status: err.msg ? "FAILURE" : "SOMETHING_WENT_WRONG", desc: "Something went wrong", err },
    status || 500
  );
}

module.exports = {
  getCurrentDate,
  sendJsonResp,
  handleErr
}