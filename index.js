/**
 * Node Script: CSV to JSON and back.
 * ------------------------------------------------------------------------------
 * A boilerplate for parsing and modifying CSV data.
 *
 * - Parses a CSV file that you input
 * - Modifies the CSV to a JSON object
 * - You run ES6 functions to modify data
 * - Output modified object to a new CSV file
 *
 * Modify to suit your needs.
 */

const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csv = require("csv-parser");
const fs = require("fs");

const inputCsvJson = [];
let modifiedCsvJson = [];

const blog_categories = {
  General: "general",
  "How to": "how-to",
  "New Feature": "new-feature",
  Uncategorized: "uncategorized",
  Userstory: "userstory",
};

/**
 * Global config.
 */
const config = {
  inputFile: "./input/production-posts-en.csv",
  outputFile: "./output/output-file-to-be-created.csv",
};

/**
 * CSV configuration - more found in csvWriter docs.
 *
 * id: Title of the column from the input CSV
 * title: title of column in output, where input data will be mapped to.
 *
 * Each header ID needs to match the CSV header title text and can be reordered.
 *
 */
const csvWriter = createCsvWriter({
  path: config.outputFile,
  header: [
    {
      id: "id",
      title: "id",
    },
    {
      id: "Title",
      title: "Title",
    },
    {
      id: "Content",
      title: "Content",
    },
    {
      id: "Kategorien",
      title: "Kategorien",
    },
    {
      id: "Image Featured",
      title: "Image Featured",
    },
    {
      id: "Date",
      title: "Date",
    },
  ],
  alwaysQuote: true,
});

/**
 * Initialise script.
 */
function init() {
  console.log("Initiating...");
  console.log(`Preparing to parse CSV file... ${config.inputFile}`);

  fs.createReadStream(config.inputFile)
    .pipe(csv({ separator: "," }))
    .on("data", (data) => inputCsvJson.push(data))
    .on("end", () => {
      modifiedCsvJson = inputCsvJson;

      console.log("...Done");

      initFunctions();
    });
}

/**
 * Execute functions once data is available.
 */
function initFunctions() {
  console.log("Initiating script functionality...");

  //modifiedCsvJson.splice(2);
  //filterPostswithImage();
  deleteGutenbergComments();
  changeCategories();

  /**
   * Once everything is finished, write to file.
   */
  writeDataToFile();
}

function filterPostswithImage() {
  modifiedCsvJson = modifiedCsvJson.filter((row) =>
    row.Content.includes("<img")
  );
}

function deleteGutenbergComments() {
  modifiedCsvJson = modifiedCsvJson.map((item) => {
    const returnedItem = item;
    const itemKey = "Content";

    returnedItem[itemKey] = item[itemKey].replace(/<!--[\s\n]+[^>]+>/g, "");

    return returnedItem;
  });
}

function changeCategories() {
  modifiedCsvJson = modifiedCsvJson.map((item) => {
    const returnedItem = item;
    const itemKey = "Kategorien";

    returnedItem[itemKey] = item[itemKey]
      .split("|")
      .map((cat) => {
        return blog_categories[cat];
      })
      .join(";");

    return returnedItem;
  });
}

/**
 * Write all modified data to its own CSV file.
 */
function writeDataToFile() {
  console.log(`Writing data to a file...`);

  csvWriter.writeRecords(modifiedCsvJson).then(() => {
    console.log("The CSV file was written successfully!");

    console.log("...Finished!");
  });
}

init();
