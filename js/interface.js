function buttonCompare() {
    clearScreen();
    buildHistory();
    historyCompare();
    displayMatch(historyEN);
    displayNoMatch(historyZH, false);
    displayNoMatch(historyEN, true);
    document.getElementById('section_compare').style.display = 'block';
    document.getElementById('submit_export').style.display = 'inline';
    document.getElementById('submit_clear').style.display = 'inline';
}

function buttonRematch() {
    rematchEntries();
    clearTableRematch();
    displayReMatch(historyEN);
    clearTableNoMatch();
    displayNoMatch(historyZH, false);
    displayNoMatch(historyEN, true);
    document.getElementById('section_rematch').style.display = 'block';
}

function buttonExport() {
    var out = historyExport(historyEN);
    document.getElementById('wikisrc_out_main').value = out.main;
    document.getElementById('wikisrc_out_ref').value = out.ref;
    document.getElementById('section_output').style.display = 'block';
}

function globalReset() {
    clearScreen();
    document.getElementById('section_compare').style.display = 'none';
    document.getElementById('section_rematch').style.display = 'none';
    document.getElementById('section_output').style.display = 'none';
    document.getElementById('submit_export').style.display = 'none';
    document.getElementById('submit_clear').style.display = 'none';
}
