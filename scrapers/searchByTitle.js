import axios from "axios";
import cheerio from "cheerio";
const BASE_URL = "https://www.imdb.com";
const CUSTOM_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
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

export default searchByTitle;