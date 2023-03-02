const express = require("express");
const fs = require("fs");
const app = express();

const PORT = process.env.PORT || 1000;

let hospitalsData = [];

app.use(express.json());

app.get("/hospitals", (req, res) => {
  hospitalsData = JSON.parse(fs.readFileSync("./hospitals.json"));
  res.json(hospitalsData);
});

app.post("/hospitals", (req, res) => {
  hospitalsData.push(req.body);
  fs.writeFileSync("./hospitals.json", JSON.stringify(hospitalsData));
  res.json({ message: "Hospital added successfully!" });
});

app.put("/hospitals/:id", (req, res) => {
  const id = parseInt(req.params.id);
  hospitalsData = JSON.parse(fs.readFileSync("./hospitals.json"));
  const hospitalToUpdate = hospitalsData.find((hospital) => hospital.id === id);
  if (!hospitalToUpdate) {
    res.status(404).json({ message: "Hospital not found" });
  } else {
    hospitalToUpdate.name = req.body.name;
    hospitalToUpdate.patients = req.body.patients;
    hospitalToUpdate.place = req.body.place;
    fs.writeFileSync("./hospitals.json", JSON.stringify(hospitalsData));
    res.json({ message: "Hospital updated successfully!" });
  }
});

app.delete("/hospitals/:id", (req, res) => {
  const id = parseInt(req.params.id);
  hospitalsData = JSON.parse(fs.readFileSync("./hospitals.json"));
  const filteredData = hospitalsData.filter((hospital) => hospital.id !== id);
  if (filteredData.length === hospitalsData.length) {
    res.status(404).json({ message: "Hospital not found" });
  } else {
    hospitalsData = filteredData;
    fs.writeFileSync("./hospitals.json", JSON.stringify(hospitalsData));
    res.json({ message: "Hospital deleted successfully!" });
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
