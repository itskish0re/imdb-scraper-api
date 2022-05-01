import axios from "axios";
import cheerio from "cheerio";

const BASE_URL = "https://www.imdb.com";
const CUSTOM_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
};

const getTitleById = async (title_id) => {
  const url = `${BASE_URL}/title/${title_id}`;
  const result = {};
  const topCast = [];
  const director = [];
  const writers = [];
  const genres = [];
  const productionCompanies = [];
  const boxOffice = {};

  await axios({
    method: "get",
    url: url,
    headers: CUSTOM_HEADERS,
  })
    .then(response => response.data.toString())
    .then((HTML) => {

      const $ = cheerio.load(HTML);
      const title = $(".sc-94726ce4-1.iNShGo > h1").text();
      const year = $(".sc-94726ce4-1.iNShGo > div > ul > li:nth-child(1) > span").text();
      const duration =
        $("div.sc-94726ce4-1.iNShGo > div > ul > li:nth-child(3)").text()
        ||
        $("div.sc-94726ce4-1.iNShGo > div > ul > li:nth-child(2)").text();
      const rating = $(
        ".sc-94726ce4-4.dyFVGl > div > div:nth-child(1) > a > div > div > " +
        "div.sc-7ab21ed2-0.fAePGh > div.sc-7ab21ed2-2.kYEdvH > span.sc-7ab21ed2-1.jGRxWM").text();
      const imageViewer = $("a[aria-label='View {Title} Poster']").attr("href").split("/?")[0];

      $("div[data-testid='title-cast-item']").each(function (){
        topCast.push({
          name: $(this).find("a.sc-11eed019-1.jFeBIw").text(),
          characterName: $(this).find("span.sc-11eed019-5.gUFDaA").text(),
          castId: $(this).find("a.sc-11eed019-1.jFeBIw").attr("href").split("?")[0].split("/")[2],
          castUrl: BASE_URL + $(this).find("a.sc-11eed019-1.jFeBIw").attr("href").split("?")[0],
          characterUrl: BASE_URL + $(this).find("a[data-testid='cast-item-characters-link']").attr("href").split("?")[0],
        });
      });

      $("section[data-testid='title-cast'] > ul > li:nth-child(1) > div > ul > li").each(function(){
        director.push({
          name: $(this).find("a").text(),
          writerId: $(this).find("a").attr("href").split("?")[0].split("/")[2],
          writerUrl: BASE_URL + $(this).find("a").attr("href").split("?")[0],
        });
      });

      $("section[data-testid='title-cast'] > ul > li:nth-child(2) > div > ul > li").each(function(){
        writers.push({
          name: $(this).find("a").text(),
          writerId: $(this).find("a").attr("href").split("?")[0].split("/")[2],
          writerUrl: BASE_URL + $(this).find("a").attr("href").split("?")[0],
        });
      });

      $("section[data-testid='Storyline'] > div > ul.IjgYL.ipc-metadata-list--base > li:nth-child(2) > div > ul > li").each(function(){
        genres.push($(this).find("a").text());
      });

      $("section[data-testid='Details'] > div.sc-f65f65be-0.ktSkVi > ul > li:nth-child(7) > div > ul > li").each(function(){
        productionCompanies.push($(this).find("a").text());
      });

      $("section[data-testid='BoxOffice'] > div.sc-f65f65be-0.ktSkVi > ul > li").each(function(){
        boxOffice[$(this).find("span.ipc-metadata-list-item__label").text()] = $(this).find("div > ul > li:nth-child(1) > span").text();
      });

      result.title = title;
      result.year = year || "N/A";
      result.duration = duration;
      result.rating = rating || "N/A";
      result.id = title_id;
      result.url = url;
      result.imageViewer = imageViewer ? `${BASE_URL}${imageViewer}` : "N/A";
      result.director = director;
      result.topCast = topCast;
      result.writers = writers;
      result.genres = genres;
      result.releaseDate =
        $("section[data-testid='Details'] > div.sc-f65f65be-0.ktSkVi > ul > li:nth-child(1) > div > ul > li > a").text()
          .replace("(United States)","");
      result.countryOfOrigin =
        $("section[data-testid='Details'] > div.sc-f65f65be-0.ktSkVi > ul > li:nth-child(2) > div > ul > li > a").text();
      result.language =
        $("section[data-testid='Details'] > div.sc-f65f65be-0.ktSkVi > ul > li:nth-child(4) > div > ul > li > a").text();
      result.productionCompanies = productionCompanies;
      result.boxOffice = boxOffice;
    })
    .catch(() => result.error = "Error occurred");
  return result;
};

export default getTitleById;