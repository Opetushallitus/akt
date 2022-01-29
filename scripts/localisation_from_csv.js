const { readFile, writeFile } = require('fs').promises;

const readCSV = async (inputFilePath, delimiter) => {
  const file = await readFile(inputFilePath, 'utf-8');
  const rows = file.split("\n");

  // Drop header
  rows.shift();

  return rows.map(row => {
    const [key, fi, sv, en] = row.split(delimiter);
    return { key, fi, sv, en };
  });
};

const writeJSONFile = async (json, lang) => {
  const data = JSON.stringify(json);
  const filePath = `./public/i18n/${lang}.json`;

  try {
  	await writeFile(filePath, data); 
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const addLocalisation = (key, localisation, json) => {
  const parsedKey = key.split(".");
  let field = json;

  if (localisation && localisation.length > 0) {
    for (let i = 0; i < parsedKey.length; i++) {
      const keyPart = parsedKey[i];

      if (! field[keyPart]) {
        field[keyPart] = {};
      }

      if (i < parsedKey.length - 1) {
        field = field[keyPart];
      } else {
        field[keyPart] = localisation;
      }
    }
  }
};

const addRow = (row, fiJson, svJson, enJson) => {
  const { key, fi, sv, en } = row;

  addLocalisation(key, fi, fiJson);
  addLocalisation(key, sv, svJson);
  addLocalisation(key, en, enJson);
};

const init = async (inputFilePath, delimiter) => {
  const csvData = await readCSV(inputFilePath, delimiter);
  const fiJson = {};
  const svJson = {};
  const enJson = {};

  csvData.forEach(row => {
    addRow(row, fiJson, svJson, enJson);
  });

  await writeJSONFile(fiJson, 'fi-FI');
  await writeJSONFile(svJson, 'sv-SE');
  await writeJSONFile(enJson, 'en-GB');
};

const args = process.argv;

const inputFilePath = args[2];
const delimiter = args[3] ? args[3] : '|';

if (! inputFilePath) {
  console.log("Input file path not given");
} else if (delimiter.length > 1) {
  console.log(`Invalid delimiter ${delimiter} given`);
} else {
  console.log(`Input file path: ${inputFilePath}, delimiter: ${delimiter}`);
  init(inputFilePath, delimiter);
}
