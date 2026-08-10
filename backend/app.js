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

const adminRoutes = require("./routes/admin/adminRoutes");

app.use("/api/admin", adminRoutes);

module.exports = app;