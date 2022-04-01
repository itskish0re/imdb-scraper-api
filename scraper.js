import axios from "axios";
import cheerio from "cheerio";
const BASE_URL = "https://www.imdb.com";

const getById = async (title_id) => {
  const url = `${BASE_URL}/title/${title_id}`;
  const result = {};
  await axios({
    method: 'get',
    url: url,
    headers: {
      "User-Agent" : "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0"
    }
  })
    .then(response => response.data.toString())
    .then((HTML) => {
      const $ = cheerio.load(HTML);
      const title = $(".sc-94726ce4-1.iNShGo > h1").text();
      const year = $(".sc-94726ce4-1.iNShGo > div > ul > li:nth-child(1) > span").text();
      const rating = $(".sc-7ab21ed2-2.kYEdvH > span").text();
      result.title = title;
      result.year = year;
      result.url = url;
    })
    .catch(() => result.error = "Error occurred");
  return result;
}

const getTop250 = async () => {
  const url = `${BASE_URL}/chart/top`;
  const result = {movies: []};
  await axios({
    method: 'get',
    url: url,
    headers: {
      "User-Agent" : "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0"
    }
  })
    .then(response => response.data.toString())
    .then((HTML) => {
      const $ = cheerio.load(HTML);
      let list = $(".lister-list > tr");
      // console.log(list);
      list.each(function (idx) {
        result.movies.push({
          movieOrder: idx + 1,
          movieId: $(this).find("td:nth-child(4) > div").data("titleid"),
          Title: $(this).find(".titleColumn > a").text(),
          Year: $(this).find(".titleColumn > span").text(),
          Rating: $(this).find(".ratingColumn.imdbRating > strong").text(),
        })
      })
    })
    .catch(() => result.error = "Error occurred");
  return result;
}


const getToptv250 = async () => {
  const url = `${BASE_URL}/chart/toptv`;
  const result = {tvShows: []};
  await axios({
    method: 'get',
    url: url,
    headers: {
      "User-Agent" : "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0"
    }
  })
    .then(response => response.data.toString())
    .then((HTML) => {
      const $ = cheerio.load(HTML);
      let list = $(".lister-list > tr");
      // console.log(list);
      list.each(function (idx) {
        result.tvShows.push({
          tvShowOrder: idx + 1,
          tvShowId: $(this).find("td:nth-child(4) > div").data("titleid"),
          Title: $(this).find(".titleColumn > a").text(),
          Year: $(this).find(".titleColumn > span").text(),
          Rating: $(this).find(".ratingColumn.imdbRating > strong").text(),
        })
      })
    })
    .catch(() => result.error = "Error occurred");
  return result;
}


// getTop250().then((response) => console.log(response));
// getToptv250().then((response) => console.log(response));
// getById("tt1877830").then((response) => console.log(response));

export {
  getToptv250,
  getTop250,
  getById
}
