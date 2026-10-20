/**
 * Generic example: stop the same student ID being entered twice in a tab.
 * Finds the ID column by its header name instead of a fixed position,
 * so it keeps working if columns are moved. Contains no client data.
 */
const ID_HEADER = 'Student ID';

function onEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idCol = headers.indexOf(ID_HEADER) + 1;

  if (idCol === 0 || range.getColumn() !== idCol || range.getRow() === 1) return;

  const value = String(range.getValue()).trim();
  if (!value) return;

  const ids = sheet
    .getRange(2, idCol, sheet.getLastRow() - 1, 1)
    .getValues()
    .map(r => String(r[0]).trim());

  const count = ids.filter(id => id === value).length;
  if (count > 1) {
    range.clearContent();
    SpreadsheetApp.getActive().toast(
      'This ID already exists in this tab. Entry removed.',
      'Duplicate ID'
    );
  }
}
