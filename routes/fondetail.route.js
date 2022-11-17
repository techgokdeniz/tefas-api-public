const router = require("express").Router();
const request = require("request");
const { parse } = require("node-html-parser");
var he = require("he");

/**
 * @swagger
 * /fon/{fonadi}:
 *    get:
 *     summary: Herhangi bir fonun detaylarını getirir.
 *     tags: [Fon Listesi]
 *     parameters:
 *       - in: path
 *         name: fonadi
 *         schema:
 *           type: string
 *         required: true
 *         description: Fon kodunu giriniz
 *     responses:
 *      '200':
 *        description: fon hakkında detayları getirir.
 */
router.get("/:fonadi", async (req, res) => {
  try {
    request(
      `https://www.tefas.gov.tr/FonAnaliz.aspx?FonKod=${req.params[
        "fonadi"
      ].toUpperCase()}`,
      {
        responseType: "arraybuffer",
        headers: { "content-type": "application/json; charset=utf-8" },
      },
      (err, response) => {
        if (response.body) {
          const root = parse(response.body);
          const VarlikRegex = new RegExp(
            /series: (\[{"name":"Varlık Dağılımı".*)/
          );
          const series = response.body.match(VarlikRegex)[1];
          const parseSeris = JSON.parse(series)[0].data.reduce(
            (total, curr) => ((total[curr[0]] = curr[1]), total),
            {}
          );

          const pricetable = Array.from(
            root.querySelectorAll(".price-indicators>ul>li>span")
          ).map((item, index) => item.innerHTML);

          const rows = root.querySelectorAll(".fund-profile-item");
          const price = Array.from(
            root.querySelectorAll(".top-list>li>span")
          ).map((item, index) => item.innerHTML);

          if (rows[0].firstChild.innerText == "&nbsp;") {
            return res
              .status(404)
              .json({ Error: true, Message: "Aradığınız Fon Bulunamadı" });
          } else {
            res.status(200).json({
              fonDetaylari: {
                FonAdi: he.decode(rows[0].firstChild.innerText),
                IsinKodu: he.decode(rows[1].firstChild.innerText),
                Durum: he.decode(rows[2].firstChild.innerText),
                BaslangicSaati: rows[3].firstChild.innerText,
                SonİslemSaati: rows[4].firstChild.innerText,
                AlisValoru: rows[5].firstChild.innerText,
                SatisValoru: rows[6].firstChild.innerText,
                MinAlim: he.decode(rows[7].firstChild.innerText),
                MinSatis: he.decode(rows[7].firstChild.innerText),
              },
              FonDagilim: parseSeris,
              fonFiyat: {
                SonFiyat: he.decode(price[0]),
                GunlukGetiri: he.decode(price[1]),
                FonDegeri: he.decode(price[3]),
              },
              FonFiyatTablosu: {
                Son1Ay: pricetable[0],
                Son3Ay: pricetable[1],
                Son6Ay: pricetable[2],
                Son1Yil: pricetable[3],
              },
            });
          }
        }
      }
    );
  } catch (err) {
    res.status(500);
  }
});

module.exports = router;
