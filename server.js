import express from "express";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(express.json());


const rawData = fs.readFileSync("./hospitaldata.json");

//Available Routes
app.get("/", (req, res) => {
  const routes = [
    { GET: "/all/hospital" },
    { POST: "/add/hospital" },
    { PUT: "/update/hospital" },
    { DELETE: "/delete/hospital" },
  ];

  res.json(routes);
});



//Get
app.get("/all/hospital/:id", (req, res) => {
  const recordID = Number(req.params.id);
  const data = JSON.parse(rawData);

  const resultData = data.filter((each) => each.id === recordID);
  res.send(resultData);
});



//Post
app.post("/add/hospital/:id", (req, res) => {
  const postData = req.body;
  const currentData = JSON.parse(rawData);
  currentData.push(postData);

  const updatedData = JSON.stringify(currentData);
  fs.writeFileSync("./hospitaldata.json", updatedData);

  res.send("Data Updated Successfully");
});


//Put
app.put('/update/hospital',(req,res) => {
    const postData = req.body;
    const data = JSON.parse(rawData);
    const currentdata = data.find(each => each.id === Number(postData['id']));
    const updatedData = {...currentdata,...postData};
    const updatedArray = data.map(each => {
        if(each.id === Number(postData['id'])){
            return updatedData;
        }
        return each;
    })
    console.log(updatedArray);
    fs.writeFileSync('./hospitaldata.json',JSON.stringify(updatedArray));
    res.send("Updated Successfully");
})


//Delete
app.delete('/delete/hospital/:id',(req,res) => {
    const recordID = req.params.id;
    const data = JSON.parse(rawData);
    const updatedArray = data.filter(each => each.id !== Number(recordID));
    fs.writeFileSync('./hospitaldata.json', JSON.stringify(updatedArray));
    res.send(`Hospital with ID ${recordID} deleted successfully`);
})



app.listen(PORT, () => {
  console.log(`app listetning at ${PORT}`);
});

