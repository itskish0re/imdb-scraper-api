import express from "express";
import * as S from "./scrapers/scraper.js";
const PORT = process.env.PORT || 5000;

const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/title/:titleId", (req, res) => {
  S.getTitleById(req.params.titleId).then((response) => res.json(response));
});

app.get("/cast/:nameId", (req, res) => {
  S.getNameById(req.params.nameId).then((response) => res.json(response));
});

app.get("/top250", (req, res) => {
  S.getTop250().then((response) => res.json(response));
});

app.get("/toptv250", (req, res) => {
  S.getToptv250().then((response) => res.json(response));
});

app.get("/search/title/:keyWord/:exact", (req, res) => {
  S.searchByTitle(req.params.keyWord, req.params.exact).then((response) => res.json(response));
});

app.get("/search/cast/:keyWord/:exact", (req, res) => {
  S.searchByName(req.params.keyWord, req.params.exact).then((response) => res.json(response));
});

app.get("/title/bulk/:titleIds", (req, res) => {
  if(req.params.titleIds.split(",").length <= 10) {
    S.bulkTitleById(req.params.titleIds).then((response) => res.json(response));
  }else {
    res.json({
      "Error": "titleids search limit is up to ten only!",
    });
  }
});

app.get("/cast/bulk/:nameIds", (req, res) => {
  if(req.params.nameIds.split(",").length <= 10) {
    S.bulkNameById(req.params.nameIds).then((response) => res.json(response));
  }else {
    res.json({
      "Error": "nameids search limit is up to ten only!",
    });
  }
});

app.get("*", (req, res) => {
  res.status(404).render("404notfound.ejs");
});

app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));

