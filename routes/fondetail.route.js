const router = require("express").Router();
const axios = require("axios");
const { parse } = require("node-html-parser");
var he = require("he");

router.get("/:fonadi", async (req, res) => {
  try {
    const response = await axios({
      url: `https://www.tefas.gov.tr/FonAnaliz.aspx?FonKod=${req.params[
        "fonadi"
      ].toUpperCase()}`,
      method: "get",
      responseType: "arraybuffer",
      headers: { "content-type": "application/json; charset=utf-8" },
    });
    const root = parse(response.data);
    res.header("Content-Type", "application/json; charset=utf-8");
    const rows = root.querySelectorAll(".fund-profile-item");
    const price = Array.from(root.querySelectorAll(".top-list>li>span")).map(
      (item, index) => item.innerHTML
    );

    if (rows[0].firstChild.innerText == "&nbsp;") {
      return res
        .status(404)
        .json({ Error: true, Message: "Aradığınız Fon Bulunamadı" });
    }

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
      fonFiyat: {
        SonFiyat: he.decode(price[0] + "₺"),
        GunlukGetiri: he.decode(price[1]),
        FonDegeri: he.decode(price[3] + "₺"),
      },
    });
  } catch (err) {
    res.status(500);
  }
});

router.get("/fonlistesi", async (req, res) => {});

module.exports = router;
