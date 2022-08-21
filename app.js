const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
require("dotenv").config();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Tefas Fon API",
      description: "Tefas Üzerindeki Fonların Detaylarının API'sidir.",
      contact: {
        name: "Developer",
      },
      servers: ["http://localhost:3000"],
    },
  },
  // ['.routes/*.js']
  apis: ["app.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", async (req, res, next) => {
  res.send({ message: "Tefas Api Server it works 🐻" });
});

// Routes
/**
 * @swagger
 * /fonlistesi:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.use("/fon", require("./routes/fondetail.route"));

app.use("/fonlistesi", require("./routes/fonlist.route"));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
