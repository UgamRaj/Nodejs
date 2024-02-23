// console.log("Web Scrapper");
import axios from "axios";
import { load } from "cheerio";
import xlsx from "xlsx";

const products = [];

(async () => {
  const url = "https://realpython.github.io/fake-jobs/";
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "text/html",
      },
    });

    const $ = load(response.data);

    const productCards = $(".card-content").each((index, data) => {
      const container = $(data);
      const jobTitle = container.find(".title.is-5").text();

      const companyName = container.find(".subtitle.is-6.company").text();
      const location = container.find(".content .location").text();
      const postedDate = container.find("[datetime]").text();

      products.push({
        "Job Title": jobTitle,
        "Company Name": companyName,
        Location: location,
        "Posted Date": postedDate,
      });
    });

    const workbook = xlsx.utils.book_new();

    const workSheet = xlsx.utils.json_to_sheet(products);
    xlsx.utils.book_append_sheet(workbook, workSheet, "Sheet1");
    xlsx.writeFile(workbook, "jobData.xlsx");
  } catch (err) {
    console.log(err);
  }
})();

//! Without IIFE

// const getDataFromAmazon = async () => {
//   const url = "https://realpython.github.io/fake-jobs/";
//   try {
//     const response = await axios.get(url, {
//       headers: {
//         "Content-Type": "text/html",
//       },
//     });

//     const $ = load(response.data);

//     const productCards = $(".card-content").each((index, data) => {
//       const container = $(data);
//       const TITLE = container.find(".title.is-5").text();

//       const COMPANY = container.find(".subtitle.is-6.company").text();
//       const LOCATION = container.find(".content .location").text();
//       products.push({ TITLE, COMPANY, LOCATION });
//     });

//     const workbook = xlsx.utils.book_new();

//     const workSheet = xlsx.utils.json_to_sheet(products);
//     xlsx.utils.book_append_sheet(workbook, workSheet, "Sheet1");
//     xlsx.writeFile(workbook, "jobData.xlsx");
//   } catch (err) {
//     console.log(err);
//   }
// };

// getDataFromAmazon();
