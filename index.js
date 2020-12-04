require("dotenv").config();
const { PULSAR_SECRET } = process.env;

const axios = require("axios");

const port = 8081;
const maxUrlLength = 75;

// Express
const app = require("express")();
app.use(require("body-parser").json());
app.use((_err, _req, res, _next) =>
  res.status(500).json({ err: "internalError" })
);
app.listen(port, () => console.log(`Server is listening on port ${port} 😎`));

// Auth
app.use((req, res, next) => {
  if (req.headers["x-pulsar-token"] === PULSAR_SECRET){
    next();
  } else {
    res.status(401).json({ err: "badAuthorization" });
  }
});

// Query
app.post("/query", function(req, res) {
  const url = req.body.query;
  let urlString = url;
  if (urlString.length > maxUrlLength) {
    urlString = urlString.slice(0, maxUrlLength)+"...";
  }
  let rickroll = false;
  let exclamationPoints = "!";
  let i = 0;
  while (i < Math.floor(Math.random()*15)) {
    exclamationPoints = exclamationPoints + "!";
    i++;
  }
  return axios.get(`https://astley.vercel.app/?url=${encodeURIComponent(url)}`).then(function(json){
    rickroll =  json.data.rickroll;
    let resText = `${urlString} is ${rickroll?"":"not "}a rickroll${rickroll?exclamationPoints:"."}`;
    if (rickroll) {
      resText = resText.toUpperCase();
    }
    return res.json({
      items: [{
        text: resText
      }]
    });
  });
});