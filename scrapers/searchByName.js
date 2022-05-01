import axios from "axios";
import cheerio from "cheerio";
const BASE_URL = "https://www.imdb.com";
const CUSTOM_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
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

export default searchByName;