const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "NeoEHS Backend API is running"
    });
});

const menuRoutes = require("./routes/menuRoutes");

app.use("/api/menu", menuRoutes);

module.exports = app;