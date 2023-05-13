const { addNewClient, getAllClient, getClient } = require("./cleintHelpers")

module.exports = {
  "/addnewclient": addNewClient,
  "/getallclient": getAllClient,
  "/getclient": getClient
}
