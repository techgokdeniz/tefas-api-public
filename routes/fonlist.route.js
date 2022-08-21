const router = require("express").Router();
const request = require("request");

const headers = {
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-US,en;q=0.9,tr;q=0.8",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
  "sec-ch-ua":
    '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
  Host: "www.tefas.gov.tr",
};

router.get("/", async (req, res) => {
  try {
    request(
      "https://www.tefas.gov.tr/FonKarsilastirma.aspx",
      {
        strictSSL: false,
        headers,
      },
      (err, response) => {
        const cookieString = response.headers["set-cookie"]
          .map((cookie) => cookie.split(";")[0])
          .join("; ");

        request(
          "https://www.tefas.gov.tr/api/DB/BindComparisonFundSizes",
          {
            strictSSL: false,
            method: "POST",
            headers: {
              ...headers,
              Cookie: cookieString,
              Accept: "application/json, text/javascript, */*; q=0.01",
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
              Referer: "https://www.tefas.gov.tr/FonKarsilastirma.aspx",
            },
            body: "calismatipi=2&fontip=YAT&sfontur=&kurucukod=&fongrup=&bastarih=24.05.2022&bittarih=23.06.2022&fonturkod=&fonunvantip=&strperiod=1%2C1%2C1%2C1%2C1%2C1%2C1&islemdurum=",
          },
          (err, response) => {
            res.json(JSON.parse(response.body));
          }
        );
      }
    );
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
