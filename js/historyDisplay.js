//Comparison status
//const MATCHSTATUS_NOMATCH = 1, MATCHSTATUS_MATCH = 2, MATCHSTATUS_REMATCH = 3, MATCHSTATUS_PARTIAL = 4;

const ID_TABLE_MATCH = 'result_table_match_tbody';
const ID_TABLE_NOMATCH_EN = 'result_table_nomatch_en_tbody';
const ID_TABLE_NOMATCH_ZH = 'result_table_nomatch_zh_tbody';
const ID_TABLE_REMATCH = 'result_table_rematch_tbody';

//Show match and partial match entries
function displayMatch(historyArray) {
    var resultTable = document.getElementById(ID_TABLE_MATCH);

    var currentDevCycle = '', currentVersion = '';
    for (let [histIndex, histEntry] of historyArray.entries()) {
        if (histEntry.matchStatus == MATCHSTATUS_MATCH || histEntry.matchStatus == MATCHSTATUS_PARTIAL) {

            //Display new devCycle if it changes
            if (currentDevCycle != histEntry.devCycle) {
                currentDevCycle = histEntry.devCycle;
                createDevCycleHeader(resultTable, currentDevCycle, 6);
            }

            var newRow = resultTable.insertRow();

            //version
            newRow.getCellAt(0).textContent = histEntry.ver;

            //snapshot
            newRow.getCellAt(1).textContent = histEntry.snap;

            //radiobutton for EN content
            var newRadio = document.createElement('input');
            newRadio.type = 'radio';
            newRadio.name = 'history_entry_radio_' + histIndex;
            newRadio.value = 'EN';
            newRow.getCellAt(2).appendChild(newRadio);

            //radiobutton for ZH content
            var radioZH = document.createElement('input');
            radioZH.type = 'radio';
            radioZH.name = 'history_entry_radio_' + histIndex;
            radioZH.value = 'ZH';
            newRow.getCellAt(4).appendChild(radioZH);

            //decide default radiobutton
            if (histEntry.matchStatus == MATCHSTATUS_MATCH) {
                newRadio.checked = false;
                radioZH.checked = true;
            } else {
                newRadio.checked = true;
                radioZH.checked = false;
            }

            //EN and ZH contents
            var contentLength = (histEntry.content.length > histEntry.matchContent.length) ? histEntry.content.length : histEntry.matchContent.length;
            for (let i = 0, contentRow = newRow; i < contentLength; i++) {
                if (i < histEntry.content.length) {
                    contentRow.getCellAt(3).textContent = histEntry.content[i];
                }
                if (i < histEntry.matchContent.length) {
                    contentRow.getCellAt(5).textContent = histEntry.matchContent[i];
                }
                if (i + 1 < contentLength)
                    contentRow = resultTable.insertRow();
            }
        }
    }
}

function createDevCycleHeader(tableElement, devCycle, columnSpan) {
    var newRow = tableElement.insertRow();
    newRow.className='devcycle_header';
    var e_td = newRow.insertCell();
    e_td.colSpan = columnSpan;
    e_td.textContent = devCycle;
}

//return cell at cellIndex, if not present then create it
HTMLTableRowElement.prototype.getCellAt = function (cellIndex) {
    rowLength = this.cells.length;
    if (rowLength <= cellIndex) {
        for (let i = 0; i < cellIndex + 1 - rowLength; i++) {
            this.insertCell();
        }
    }
    return this.cells[cellIndex];
}

function displayNoMatch(historyArray, isFromEN) {
    var resultTable;
    if (isFromEN)
        resultTable = document.getElementById(ID_TABLE_NOMATCH_EN);
    else
        resultTable = document.getElementById(ID_TABLE_NOMATCH_ZH);

    var currentDevCycle = '', currentVersion = '';
    for (let [histIndex, histEntry] of historyArray.entries()) {
        if (isFromEN && histEntry.matchStatus != MATCHSTATUS_NOMATCH) continue;

        //Display new devCycle if it changes
        if (currentDevCycle != histEntry.devCycle) {
            currentDevCycle = histEntry.devCycle;
            createDevCycleHeader(resultTable, currentDevCycle, 4);
        }

        var newRow = resultTable.insertRow();

        //version
        newRow.getCellAt(1).textContent = histEntry.ver;

        //snapshot
        newRow.getCellAt(2).textContent = histEntry.snap;

        //radiobutton
        var newRadio = document.createElement('input');
        newRadio.type = 'radio';
        newRadio.value = histIndex;
        if (isFromEN) {
            newRadio.name = 'history_entry_unmatch_EN';
        } else {
            newRadio.name = 'history_entry_unmatch_ZH';
        }
        newRow.getCellAt(0).appendChild(newRadio);

        //content
        for (let i = 0, contentRow = newRow; i < histEntry.content.length; i++) {
            contentRow.getCellAt(3).textContent = histEntry.content[i];
            if (i + 1 < histEntry.content.length)
                contentRow = resultTable.insertRow();
        }
    }
}

function displayReMatch(historyArray) {
    var resultTable = document.getElementById(ID_TABLE_REMATCH);
    for (let histEntry of historyArray) {
        if (histEntry.matchStatus == MATCHSTATUS_REMATCH) {
            var newRow = resultTable.insertRow();

            //EN entry
            //devCycle
            newRow.getCellAt(0).textContent = histEntry.devCycle;

            //version
            newRow.getCellAt(1).textContent = histEntry.ver;

            //snapshot
            newRow.getCellAt(2).textContent = histEntry.snap;

            //table seperator
            newRow.getCellAt(3).textContent = '<==>';

            //ZH entry
            //devCycle
            newRow.getCellAt(4).textContent = histEntry.rematchEntry.devCycle;

            //version
            newRow.getCellAt(5).textContent = histEntry.rematchEntry.ver;

            //snapshot
            newRow.getCellAt(6).textContent = histEntry.rematchEntry.snap;
        }
    }
}

function clearScreen() {
    clearTableMatch();
    clearTableNoMatch();
    clearTableRematch();
}

function clearTableMatch() {
    document.getElementById(ID_TABLE_MATCH).innerHTML = '';
}

function clearTableNoMatch() {
    document.getElementById(ID_TABLE_NOMATCH_EN).innerHTML = '';
    document.getElementById(ID_TABLE_NOMATCH_ZH).innerHTML = '';
}

function clearTableRematch() {
    document.getElementById(ID_TABLE_REMATCH).innerHTML = '';
}