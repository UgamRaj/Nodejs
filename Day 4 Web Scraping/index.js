import axios from "axios";
import { load } from "cheerio";
import xlsx from "xlsx";

const products = [];

(async () => {
  const url =
    "https://www.amazon.in/s?k=phone+8gb&crid=3A4P1G967ZMPT&sprefix=phone+8gb%2Caps%2C336&ref=nb_sb_noss_1";
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "text/html",
      },
    });

    const $ = load(response.data);

    const productCards = $("[data-asin]").each((index, data) => {
      const container = $(data);
      const productName = container
        .find("span.a-size-medium.a-color-base.a-text-normal")
        .text();
      const productPrice = container.find(".a-price-whole").text();
      const productRating = container.find(".a-icon-alt").text();
      products.push({
        "Product Name": productName,
        Price: productPrice,
        "Product Rating": productRating,
      });
    });

    const workbook = xlsx.utils.book_new();

    const workSheet = xlsx.utils.json_to_sheet(products);
    xlsx.utils.book_append_sheet(workbook, workSheet, "Sheet2");
    xlsx.writeFile(workbook, "products.xlsx");
    console.log("XLSX file created successfully!");
  } catch (err) {
    console.log(err);
  }
})();
