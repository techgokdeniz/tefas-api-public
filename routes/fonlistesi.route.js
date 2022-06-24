const router = require("express").Router();
const axios = require("axios");
const { parse } = require("node-html-parser");
var he = require("he");

router.get("/", async (req, res) => {
  const response = await axios(
    "https://www.tefas.gov.tr/FonKarsilastirma.aspx"
  );
  res.send(response.headers["set-cookie"]);
});

module.exports = router;
