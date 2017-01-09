function Init() {
    VulChecklists();
}
function GetKruisvakjes(pLijst) {
    var lInvoer = document.getElementById(pLijst + '-vakjes').elements;
    var lKruisvakjes = [];
    for (var i = 0; i < lInvoer.length; i++) {
        if (lInvoer[i].type == "checkbox") lKruisvakjes.push(lInvoer[i])
    }
    return lKruisvakjes;
}
function VulLijst(pLijst) {
    var lKruisvakjes = GetKruisvakjes(pLijst);
    var lPromptNaam = 'data-' + pLijst + '-prompt';
    var lTekstID    = pLijst + '-tekst';
    var lTekst = 'h4. Definition of Ready';
    for (var i = 0; i < lKruisvakjes.length; i++)
        if (lKruisvakjes[i].checked)
            lTekst += '\n*' + lKruisvakjes[i].getAttribute(lPromptNaam);
    document.getElementById(lTekstID).value = lTekst;
}
function VulChecklists() {
    var lLijsten = ['dor','dod'];
    for (var i = 0; i < lLijsten.length; i++) VulLijst(lLijsten[i]);
}
//  https://www.sitepoint.com/use-html5-data-attributes/
//
// var msglist = document.getElementById("msglist");

// var show = msglist.dataset.listSize;
// msglist.dataset.listSize = +show+3;


// var elements = document.getElementById("my-form").elements;
//
// for (var i = 0, element; element = elements[i++];) {
    // if (element.type === "text" && element.value === "")
        // console.log("it's an empty textfield")
// }
