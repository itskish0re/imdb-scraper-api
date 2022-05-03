import axios from "axios";
import cheerio from "cheerio";

const BASE_URL = "https://www.imdb.com";
const CUSTOM_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
};

const getNameById = async (name_id) => {
  const url = `${BASE_URL}/name/${name_id}`;
  const result = {};
  const born = {};
  const roles = [];
  const personalDetails = {
    publicListing: undefined,
    socialmedia: {},
    alternateNames: undefined,
    height: undefined,
    spouse: [],
    children: [],
    parents: [],
    starSign: undefined,
  };
  const filmography = {};

  await axios({
    method: "get",
    url: url,
    headers: CUSTOM_HEADERS,
  })
    .then(response => response.data.toString())
    .then((HTML) => {

      const $ = cheerio.load(HTML);
      const name = $(".name-overview-widget__section > h1 > span").text();
      born.date = $("div#name-born-info > time").text().trim().replace(/\s\s+/g," ");
      born.place = $("div#name-born-info > a").text();
      const bio = $(".name-trivia-bio-text > div.inline").text().trim().replace(/\s\s+/g," ").split("...")[0].trim();
      const imageUrl = $("td#img_primary > div > div > a > img").attr("src");
      $("div#name-job-categories > a").each(function(){
        roles.push($(this).find("span.itemprop").text().trim());
      });

      personalDetails.publicListing = $("div#details-publicity-listings").text()
        .replace(/\s\s+/g, " ").split(":")[1].replace("| See more » ", "").trim().split(" | ");
      personalDetails.socialmedia.facebook = $("div#details-official-sites > a[data-ref='nm_pdt_ofs_offsite_0']").attr("href");
      personalDetails.socialmedia.instagram = $("div#details-official-sites > a[data-ref='nm_pdt_ofs_offsite_1']").attr("href");
      personalDetails.alternateNames = $("div#details-akas").text().replace(/\s\s+/g, " ").split(":")[1].trim().split(" | ") || "N/A";
      personalDetails.height = $("div#details-height").text().replace(/\s/g, " ").split(":")[1].trim();
      $("div#details-spouses > a").each(function (){
        personalDetails.spouse.push({
          name: $(this).text(),
          nameId: $(this).attr("href").split("?")[0].split("/")[2],
        });
      });
      $("div#details-children > a").each(function (){
        personalDetails.children.push({
          name: $(this).text(),
          nameId: $(this).attr("href").split("?")[0].split("/")[2],
        });
      });
      $("div#details-parents > a").each(function(){
        personalDetails.parents.push({
          name: $(this).text(),
          nameId: $(this).attr("href").split("?")[0].split("/")[2],
        });
      });
      personalDetails.starSign = $("div#dyk-star-sign > a").text();

      $("div#filmography > div[data-category]").each(function (){
        const type = $(this).text().replace(/\s+/g," ").trim().replace("Hide Show ","");
        filmography[type] = [];
        $(this).next().children("div").each(function (){
          filmography[type].push({
            title: $(this).find("b > a").text(),
            titleId: $(this).find("b > a").attr("href").split("/")[2],
            year: $(this).find("span").text().replace(/\s+/g,"") || "N/A",
          });
        });
      });


      result.name = name;
      result.nameId = name_id;
      result.born = born;
      result.roles = roles;
      result.bio = bio;
      result.url = BASE_URL + url;
      result.imageUrl = imageUrl;
      result.personalDetails = personalDetails;
      result.filmography = filmography;
      result.awards = $("span.awards-blurb > b").text().trim().replace(/\s\s+/g," ") || "N/A";

    })
    .catch(() => result.error = "Error occurred");
  return result;
};

export default getNameById;