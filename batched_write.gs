/**
 * Generic example: ingest rows into a sheet in batches, skipping duplicates.
 * Written for this case study. Contains no client data.
 */
const BATCH_SIZE = 2000;

function ingestRows(sheetName, incomingRows, keyColumnIndex) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  const lastRow = sheet.getLastRow();

  // Read existing keys once, then use a Set for fast duplicate checks.
  const existingKeys = new Set();
  if (lastRow > 1) {
    sheet
      .getRange(2, keyColumnIndex + 1, lastRow - 1, 1)
      .getValues()
      .forEach(r => existingKeys.add(String(r[0])));
  }

  const newRows = incomingRows.filter(r => {
    const key = String(r[keyColumnIndex]);
    if (existingKeys.has(key)) return false;
    existingKeys.add(key);
    return true;
  });

  for (let i = 0; i < newRows.length; i += BATCH_SIZE) {
    const batch = newRows.slice(i, i + BATCH_SIZE);
    sheet
      .getRange(sheet.getLastRow() + 1, 1, batch.length, batch[0].length)
      .setValues(batch);
  }

  SpreadsheetApp.flush(); // one flush at the end
  return newRows.length;
}
