import axios from "axios";
import cheerio from "cheerio";

const BASE_URL = "https://www.imdb.com";
const CUSTOM_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
};

const getTop250 = async () => {
  const url = `${BASE_URL}/chart/top`;
  const result = {movies: []};
  await axios({
    method: "get",
    url: url,
    headers: CUSTOM_HEADERS,
  })
    .then(response => response.data.toString())
    .then((HTML) => {
      const $ = cheerio.load(HTML);
      let list = $(".lister-list > tr");
      list.each(function (idx) {
        result.movies.push({
          rank: idx + 1,
          movieId: $(this).find("td:nth-child(4) > div").data("titleid"),
          Title: $(this).find(".titleColumn > a").text(),
          Year: $(this).find(".titleColumn > span").text(),
          Rating: $(this).find(".ratingColumn.imdbRating > strong").text(),
        });
      });
    })
    .catch(() => result.error = "Error occurred");
  return result;
};

const getToptv250 = async () => {
  const url = `${BASE_URL}/chart/toptv`;
  const result = {tvShows: []};
  await axios({
    method: "get",
    url: url,
    headers: CUSTOM_HEADERS,
  })
    .then(response => response.data.toString())
    .then((HTML) => {
      const $ = cheerio.load(HTML);
      let list = $(".lister-list > tr");
      // console.log(list);
      list.each(function (idx) {
        result.tvShows.push({
          rank: idx + 1,
          tvShowId: $(this).find("td:nth-child(4) > div").data("titleid"),
          Title: $(this).find(".titleColumn > a").text(),
          Year: $(this).find(".titleColumn > span").text(),
          Rating: $(this).find(".ratingColumn.imdbRating > strong").text(),
        });
      });
    })
    .catch(() => result.error = "Error occurred");
  return result;
};

const searchByTitle = async (keyWord, exact = false) => {
  const url = `${BASE_URL}/find?q=${keyWord}&s=tt&exact=${exact}&ref_=fn_tt_ex`;
  const result = {
    keyWord,
    exactMatch: exact,
    totalMatches: undefined,
    list: [],
  };
  await axios({
    method: "get",
    url: url,
    headers: CUSTOM_HEADERS,
  })
    .then(response => response.data.toString())
    .then((HTML) => {
      const $ = cheerio.load(HTML);
      const table = $("div.findSection > table > tbody > tr");
      table.each(function (){
        const title = $(this).find("td.result_text").text().trim().replace(/"/g, "'");
        const url = $(this).find("td.result_text > a").attr("href");
        result.totalMatches = $("div > h1.findHeader").text().trim().split(" ")[1];
        result.list.push({
          title,
          titleId: url.split("/")[2],
          url: BASE_URL + url,
        });
      });
    })
    .catch(() => result.error = "Error occurred");
  return result;
};

const searchByName = async (keyWord, exact = false) => {
  const url = `${BASE_URL}/find?q=${keyWord}&s=nm&exact=${exact}`;
  const ABOUT_PATTERN = RegExp("(?<=\().*(?=\))");
  const OCCUPATION_PATTERN = /[a-zA-Z]+/;
  const result = {
    keyWord,
    exactMatch: exact,
    totalMatches: undefined,
    list: [],
  };
  await axios({
    method: "get",
    url: url,
    headers: CUSTOM_HEADERS,
  })
    .then(response => response.data.toString())
    .then((HTML) => {
      const $ = cheerio.load(HTML);
      const table = $("div.findSection > table > tbody > tr");
      table.each(function (){
        const name = $(this).find("td.result_text > a").text().trim();
        const about = ABOUT_PATTERN.exec($(this).find("td.result_text > small").text().trim())[0];
        const occupation = OCCUPATION_PATTERN.exec(about)[0];
        const majorWork = about.substr(about.indexOf(", ") + 2);
        const url = $(this).find("td.result_text > a").attr("href");
        result.totalMatches = $("div > h1.findHeader").text().trim().split(" ")[1];
        result.list.push({
          name,
          occupation,
          majorWork,
          nameId: url.split("/")[2],
          url: BASE_URL + url,
        });
      });
    })
    .catch(() => result.error = "Error occurred");
  return result;
};

const bulkTitleSearch = async (titleIds) => {
  titleIds = titleIds.split(",");
  const result = [];
  titleIds.map((titleId) => getTitleById(titleId).then(response => result.push(response)));
  return result;
};

export {
  getToptv250,
  getTop250,
  searchByTitle,
  searchByName,
};