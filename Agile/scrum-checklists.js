function Init() {
    VulChecklists();
}
function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return undefined;
    if (!results[2]) return undefined;
    return decodeURIComponent(results[2].replace(/\+/g, " "));
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
    var lTekst = (pLijst == 'dor') ? 'h4. Definition of Ready' : 'h4. Definition of Done';
    for (var i = 0; i < lKruisvakjes.length; i++)
        if (lKruisvakjes[i].checked)
            lTekst += '\n*' + lKruisvakjes[i].getAttribute(lPromptNaam);
    document.getElementById(lTekstID).value = lTekst;
}
function GetLijsten() {
         if (getParameterByName('lijst')               == undefined) return ['dor','dod'];
    else if (getParameterByName('lijst')               == null     ) return ['dor','dod'];
    else if (getParameterByName('lijst').toLowerCase() == 'ready'  ) return ['dor'];
    else if (getParameterByName('lijst').toLowerCase() == 'done'   ) return ['dod'];
    else                                                           return ['dor','dod'];

}
function VulChecklists() {
    // var lLijsten = ['dor','dod'];
    var lLijsten = GetLijsten();
    for (var i = 0; i < lLijsten.length; i++) {
        document.getElementById(lLijsten[i]).style.display = 'block';
        VulLijst(lLijsten[i]);
    }
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
