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

export default getTop250;