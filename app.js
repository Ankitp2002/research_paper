const express = require("express");
const userRoutes = require("./routes/userRoutes");
const authorRoutes = require("./routes/authorRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const statsRoutes = require("./routes/statsRoutes");
const backupRoutes = require("./routes/backupRoutes");
const sequelize = require("./config/db");
const swaggerDocument = require("./swagger-output.json");
const swaggerUi = require("swagger-ui-express");
const authMiddleware = require("./middleware/authMiddleware");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const openRoute = express.Router();
const authRoute = express.Router();

app.use(openRoute);
app.use(authRoute);

// Open APIs
openRoute.use(cors());
openRoute.use(bodyParser.json());
openRoute.use(bodyParser.urlencoded({ extended: false }));
openRoute.use("/api/users", userRoutes);
// Swagger configuration options
openRoute.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Auth Required
authRoute.use(cors());
authRoute.use(bodyParser.json());
authRoute.use(bodyParser.urlencoded({ extended: false }));
// authRoute.use(authMiddleware);

authRoute.use("/api/author", authorRoutes);
authRoute.use("/api/reviews", reviewRoutes);
authRoute.use("/api/stats", statsRoutes);
authRoute.use("/api/backups", backupRoutes);

// server start and DB conenctivity
app.listen(process.env.PORT, async () => {
  console.log(`Server running on port ${process.env.PORT}`);
  await sequelize.authenticate();
  console.log("Database connected!");
});
