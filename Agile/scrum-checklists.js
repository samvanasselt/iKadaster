function Init() {}

function VulDoD() {
    var lKruisvakjes = ['dod-story-definition-of-done', 'dod-product-owner-tevreden'];
    var lVakje;
    var lTekst = 'h4. Definition of Done';
    for (var i = 0; i < lKruisvakjes.length; i++) {
        lVakje = document.getElementById(lKruisvakjes[i]);
        if (lVakje.checked) lTekst += '\n*' + lVakje.getAttribute('data-dod-prompt');
    }
    document.getElementById('dod').value = lTekst;
}
//  https://www.sitepoint.com/use-html5-data-attributes/
//
// var msglist = document.getElementById("msglist");

// var show = msglist.dataset.listSize;
// msglist.dataset.listSize = +show+3;
