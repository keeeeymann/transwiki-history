//rematching entries just gives a reference of old ZH content
function rematchEntries() {
    var isRadioCheckedEN = false, isRadioCheckedZH = false;
    var entryEN = null, entryZH = null;

    for (let radiobutton of document.getElementsByName('history_entry_unmatch_EN')) {
        if (radiobutton.checked) {
            entryEN = historyEN[radiobutton.value];
            break;
        }
    }
    if (entryEN === null) {
        alert('Please select EN entry');
        return;
    }

    for (let radiobutton of document.getElementsByName('history_entry_unmatch_ZH')) {
        if (radiobutton.checked) {
            entryZH = historyZH[radiobutton.value];
            historyZH.splice(radiobutton.value, 1); //delete rematched entry from ZH
            break;
        }
    }
    if (entryEN === null) {
        alert('Please select ZH entry');
        return;
    }

    entryEN.matchStatus = MATCHSTATUS_REMATCH;
    entryEN.rematchEntry = entryZH;
}

//return: main code and reference (matched) code
function historyExport(historyArray) {
    var out = {};
    out.main = '';
    out.ref = '';

    var currentDevCycle = '', currentVersion = '';
    for (let [histIndex, histEntry] of historyArray.entries()) {
        let entryText = '{{History|';

        //devCycle
        if (currentDevCycle != histEntry.devCycle) {
            currentDevCycle = histEntry.devCycle;
            out.main += '{{History|' + currentDevCycle + '}}\n';
        }
        entryText += '|';

        //version
        if (currentVersion != histEntry.ver) {
            currentVersion = histEntry.ver;
            entryText += histEntry.ver + '|';
        } else entryText += '|';

        //others
        if (histEntry.snap) entryText += 'snap=' + histEntry.snap + '|';
        if (histEntry.link) entryText += 'link=' + histEntry.link + '|';
        if (histEntry.slink) entryText += 'slink=' + histEntry.slink + '|';

        //content
        switch (histEntry.matchStatus) {

            case MATCHSTATUS_MATCH:
            case MATCHSTATUS_PARTIAL:
                for (let radiobutton of document.getElementsByName('history_entry_radio_' + histIndex)) {
                    if (radiobutton.checked) {
                        if (radiobutton.value == 'EN') {
                            entryText += histEntry.content.join('\n|');
                        } else if (radiobutton.value == 'ZH') {
                            entryText += histEntry.matchContent.join('\n|');
                        }
                        break;
                    }
                }
                break;

            case MATCHSTATUS_NOMATCH:
            case MATCHSTATUS_REMATCH:
                entryText += histEntry.content.join('\n|');
                break;

            default:
                console.assert(false, 'historyExport(): error: unknown matchStatus');
        }
        out.main += entryText + '}}\n';
        //rematch reference
        if (histEntry.matchStatus == MATCHSTATUS_REMATCH) {
            out.ref += histEntry.devCycle + '|' + histEntry.ver + '|' + (histEntry.snap ? histEntry.snap : '') + ' ==>\n\t' +
                histEntry.rematchEntry.devCycle + '|' + histEntry.rematchEntry.ver + '|' +
                (histEntry.rematchEntry.snap ? histEntry.rematchEntry.snap + '|' : '') +
                (histEntry.rematchEntry.link ? histEntry.rematchEntry.link + '|' : '') +
                (histEntry.rematchEntry.slink ? histEntry.rematchEntry.slink + '|' : '') +
                histEntry.rematchEntry.content.join('\n\t|') + '\n';
        }
    }
    out.main += '{{history|foot}}';
    return out;
}
