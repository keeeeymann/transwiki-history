//Using ECMAScript 2016

//HistoryEntry Object must contain:
//- devCycle: string (indev, infdev, beta, etc.)
//- ver: string, version
//- content: array
//... and may also contain:
//- snap: string, snapshot
//- link: string, version link
//- slink: string, snapshot link
//- matchStatus: const MATCHSTATUS_*
//- matchContent: array
//- rematchEntry: HistoryEntry

//Arrays of HistoryEntry
var historyEN, historyZH;

//Comparison status
const MATCHSTATUS_NOMATCH = 1, MATCHSTATUS_MATCH = 2, MATCHSTATUS_REMATCH = 3, MATCHSTATUS_PARTIAL = 4;

//Extract arguments according to syntax
function historyTextProcess(historyString) {
    if (typeof historyString !== 'string') {
        console.assert(false, 'HistoryEntryTextProcess(): input error: not a string');
        return;
    }
    var sectionArray = [];
    var entryArray = [];
    var argument = '';

    var braceLeft = 0, squareBracketLeft = 0;
    for (let letter of historyString.trim()) {
        switch (letter) {
            case '{':
                braceLeft++;
                if (braceLeft > 2) {
                    argument += '{';
                }
                break;

            case '}':
                braceLeft--;
                if (braceLeft >= 2) {
                    argument += '}';
                }
                else if (braceLeft === 0) {
                    entryArray.push(argument.trim());
                    sectionArray.push(entryArray);
                    entryArray = [];
                    argument = '';
                }
                else if (braceLeft < 0) {
                    console.assert(false, 'HistoryEntryTextProcess(): History syntax error: braces do not match');
                    return;
                }
                break;

            case '[':
                squareBracketLeft++;
                argument += '[';
                break;

            case ']':
                squareBracketLeft--;
                argument += ']';
                console.assert(squareBracketLeft >= 0, 'HistoryEntryTextProcess(): general syntax warning: square brackets do not match');
                break;

            case '|':
                if (braceLeft == 2 && !squareBracketLeft) {
                    entryArray.push(argument.trim());
                    argument = '';
                } else {
                    argument += '|';
                }
                break;

            default: argument += letter;
        }
    }
    return sectionArray;
}

//Generate an array of HistoryEntry from an array of trimmed argument text 
function loadHistoryEntriesFromArray(historySectionArray) {
    if (!(historySectionArray instanceof Array)) {
        console.assert(false, 'loadHistoryEntriesFromArray(): input error: not an array');
        return;
    }
    if (historySectionArray.length == 0) return [];

    var historyEntries = [];

    var lastDevCycle = '', lastVersion = '';
    for (let entryArray of historySectionArray) {

        //check if it's a history template
        if (entryArray[0].toLowerCase() != 'history') {
            console.assert(false, 'loadHistoryEntriesFromArray(): History syntax error: not a history template');
            return;
        }

        var entryObject = {};

        //read development Cycle
        if (entryArray[1]) {
            entryObject.devCycle = entryArray[1];
            lastDevCycle = entryArray[1];
        }
        else
            entryObject.devCycle = lastDevCycle;
        console.assert(entryObject.devCycle, 'loadHistoryEntriesFromArray(): History syntax error: missing devCycle');

        //read version
        if (entryArray.length == 2) {
            continue; //Just a devCycle header; continue without saving
        } else if (entryArray[2]) {
            entryObject.ver = entryArray[2];
            lastVersion = entryArray[2];
        } else
            entryObject.ver = lastVersion;
        console.assert(entryObject.ver, 'loadHistoryEntriesFromArray(): History syntax error: missing version');

        //read the rest
        entryObject.content = [];
        for (let i = 3, lenA = entryArray.length; i < lenA; i++) {
            if (entryArray[i].indexOf('snap=') === 0) { //found {{{snap}}}
                entryObject.snap = entryArray[i].substring(String('snap=').length).trim(); //take the rest as snapshot version
            } else if (entryArray[i].indexOf("slink=") === 0) { //found {{{slink}}}
                entryObject.slink = entryArray[i].substring(String('slink=').length).trim(); //take the rest as snapshot link
            } else if (entryArray[i].indexOf("link=") === 0) { //found {{{link}}}
                entryObject.link = entryArray[i].substring(String('link=').length).trim(); //take the rest as version link
            } else { //normal content
                entryObject.content.push(entryArray[i]);
            }
        }
        historyEntries.push(entryObject);
    }
    return historyEntries;
}

function buildHistory() {
    historyEN = loadHistoryEntriesFromArray(historyTextProcess(document.getElementById("wikisrc_en").value));
    historyZH = loadHistoryEntriesFromArray(historyTextProcess(document.getElementById("wikisrc_zh").value));
}

//A partial match means coherience in devCycle, version and snapshot
//A total match means a partial match plus coherience in content count
//Always use link and slink from EN history
function historyCompare() {
    for (let elemEN of historyEN) {
        var matched = false;
        for (let [indexZH, elemZH] of historyZH.entries()) {
            if (elemEN.devCycle == elemZH.devCycle && elemEN.ver == elemZH.ver && elemEN.snap == elemZH.snap) { //may be undefined but should work properly
                matched = true;
                if (elemEN.content.length == elemZH.content.length) {
                    elemEN.matchStatus = MATCHSTATUS_MATCH;
                }
                else {
                    elemEN.matchStatus = MATCHSTATUS_PARTIAL;
                }

                elemEN.matchContent = elemZH.content;
                historyZH.splice(indexZH, 1); //delete matching ZH entries
                break;
            }
        }
        if (!matched) {
            elemEN.matchStatus = MATCHSTATUS_NOMATCH;
        }
    }
}