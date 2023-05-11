const { addNewClient, getAllClient } = require("./cleintHelpers")

module.exports = {
  "/addnewclient": addNewClient,
  "/getallclient": getAllClient
}
