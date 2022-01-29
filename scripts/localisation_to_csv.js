const { readFile, writeFile } = require('fs').promises;

const parseJSONFile = async inputFilePath => {
  try {
    const file = await readFile(inputFilePath);
    return JSON.parse(file);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const writeCSV = async (outputFilePath, csvRows) => {
  try {
  	await writeFile(outputFilePath, csvRows, 'utf8'); 
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const init = async () => {
  const setKeys = (field, key) => {
    if (typeof field === 'object' && field !== null) {
      Object.keys(field).map(childName => {
        const childField = field[childName];
        const childKey = key ? `${key}.${childName}` : childName;

        setKeys(childField, childKey);
      });
    } else {
      keys.push(key);
    }
  };

  const getLocalisation = (key, json) => {

    const getValue = (field, parsedKey) => {
      const key = parsedKey && parsedKey[0];

      if (field && key && field[key]) {
        // Drop first elem
        parsedKey.shift();

        return getValue(field[key], parsedKey);
      }

      return typeof field === 'string' ? field : '';
    };

    return getValue(json, key.split('.'));
  };

  const inputFileDir = `./public/i18n/`;
  const outputFilePath = `./localisation.csv`

  let keys = [];
  const fiJson = await parseJSONFile(`${inputFileDir}fi-FI.json`);
  const svJson = await parseJSONFile(`${inputFileDir}sv-SE.json`);
  const enJson = await parseJSONFile(`${inputFileDir}en-GB.json`);

  // Finnish localisation file is expected to contain all localisation keys
  setKeys(fiJson);

  const csvHeader = 'Käännös|suomi|ruotsi|englanti\n';

  const csvData = keys.map(key => {
    const fi = getLocalisation(key, fiJson);
    const sv = getLocalisation(key, svJson);
    const en = getLocalisation(key, enJson);

    return `${key}|${fi}|${sv}|${en}\n`;
  });

  await writeCSV(outputFilePath, [csvHeader, ...csvData]);

  console.log("Localisation csv output in ./localisation.csv")
};

init();
