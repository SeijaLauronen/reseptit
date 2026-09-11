// aja muunto komennolla
// node src/fineli/transform/buildFineliDataset.js

const fs = require("fs");
const path = require("path");

const { parseCsv, parseNumber } = require("./parseCsv");

const rawDir = path.join(__dirname, "../data/raw");
const processedDir = path.join(__dirname, "../data/processed");

const foodFile = path.join(rawDir, "food.csv");
const foodAddUnitFile = path.join(rawDir, "foodaddunit.csv");
const componentFile = path.join(rawDir, "component.csv");
const componentValueFile = path.join(rawDir, "component_value.csv");

function readCsv(filePath) {
    const text = fs.readFileSync(filePath, "utf8");
    return parseCsv(text);
}


// Finelin yksiköiden käyttäjälle näytettävät nimet.
// G on Ostokseni-sovelluksen oma yksikkö.
const unitDefinitions = {
    G: "g",
    PORTS: "pieni annos",
    PORTM: "keskikokoinen annos",
    PORTL: "iso annos",
    DL: "dl",
    RKL: "rkl",
    TL: "tl",
    KPL_M: "kpl",
    KPL_S: "pieni",
    KPL_L: "iso",
    KPL_VALM: "valmistettu"
};


console.log("Luetaan Fineli-tiedostot...");

const foods = readCsv(foodFile);
const foodAddUnits = readCsv(foodAddUnitFile);
const components = readCsv(componentFile);
const componentValues = readCsv(componentValueFile);

console.log(`Ruokia: ${foods.length}`);
console.log(`Annosmittoja: ${foodAddUnits.length}`);
console.log(`Ravintoaineita: ${components.length}`);
console.log(`Ravintoarvorivejä: ${componentValues.length}`);


// Ravintoaineiden yksiköt
const componentMap = new Map();

components.forEach(component => {
    componentMap.set(component.EUFDNAME, {
        unit: component.COMPUNIT,
        class: component.CMPCLASS,
        parentClass: component.CMPCLASSP
    });
});


// Annosmitat FOODID:n mukaan
const unitsMap = new Map();

foodAddUnits.forEach(row => {
    const foodId = Number(row.FOODID);

    if (!unitsMap.has(foodId)) {
        unitsMap.set(foodId, []);
    }

    unitsMap.get(foodId).push({
        code: row.FOODUNIT,
        grams: parseNumber(row.MASS)
    });
});


// Ravintoarvot FOODID:n mukaan
const nutrientsMap = new Map();

componentValues.forEach(row => {
    const foodId = Number(row.FOODID);

    if (!nutrientsMap.has(foodId)) {
        nutrientsMap.set(foodId, {});
    }

    nutrientsMap.get(foodId)[row.EUFDNAME] = {
        value: parseNumber(row.BESTLOC),
        unit: componentMap.get(row.EUFDNAME)?.unit ?? null
    };
});


// Rakennetaan lopullinen datasetti
const dataset = foods.map(food => {
    const id = Number(food.FOODID);

    const fineliUnits = unitsMap.get(id) ?? [];

    // G on aina ensimmäisenä.
    // Se on Ostokseni-sovelluksen oma yksikkö:
    // käyttäjä antaa grammojen määrän itse.
    const units = [
        { code: "G" },
        ...fineliUnits
    ];

    return {
        id,
        name: food.FOODNAME,
        ediblePortion: parseNumber(food.EDPORT),
        units,
        nutrients: nutrientsMap.get(id) ?? {}
    };
});


// JSONin juuritasolla:
// - unitDefinitions sisältää yksiköiden nimet kerran
// - foods sisältää varsinaiset ruokakohtaiset tiedot
const datasetWithDefinitions = {
    unitDefinitions,
    foods: dataset
};


fs.mkdirSync(processedDir, { recursive: true });

const outputFile = path.join(processedDir, "fineli-data.json");

fs.writeFileSync(
    outputFile,
    JSON.stringify(datasetWithDefinitions, null, 2),
    "utf8"
);

console.log("");
console.log(`Valmis: ${outputFile}`);
console.log(`Tuotetietueita: ${dataset.length}`);