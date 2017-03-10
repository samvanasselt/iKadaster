//  https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage
    var ctx;      
function canvasUitproberen(){
    var canvas = document.getElementById('canvasAster');
    if (canvas.getContext){
        ctx = canvas.getContext('2d');
        ctx.scale(4, 4);
        var w = 10;
        var h = 10;
        var dx = 0;
        ctx.font="3px Verdana";
        ctx.fillStyle = "rgb(223,223,223)";
        ctx.fillRect (0,0,100,100);
        ctx.fillStyle = "rgb(195,195,195)";
        try { for (var y = 0; y < 100; y += 10) {
            for (var x = 0; x < 100; x += 20) {
                dx = y % 20;
                // dump('x,y,w,h = ' + x + ','  + y + ','  + w + ','  + h);
                // alert('x,y,w,h = ' + x + ','  + y + ','  + w + ','  + h);
                ctx.fillRect (x + dx,y,w,h);
                // ctx.fillText( ' ' + y/10 + (x + dx)/10, x + dx, y);
        // }}
        }}}   
        catch(err) { alert(err);}

          
        // ctx.fillStyle = "rgb(200,0,0)";
          // var x = 10;
          // var y = 20;
          // var w = 30;
          // var h = 40;
 
        // ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        // ctx.fillRect (30, 30, 55, 50);
 
        // // Teken driehoek  
        // ctx.fillStyle = "rgba(127, 127, 127, 0.4)";
          // ctx.beginPath();
          // ctx.moveTo(75,50);
          // ctx.lineTo(100,75);
          // ctx.lineTo(100,25);
          // ctx.fill();
         
     }
}
function kleurVeld(pX, pY, pKleur) {
    var canvas = document.getElementById('canvasAster');
    if (canvas.getContext){
        ctx = canvas.getContext('2d');
        ctx.fillStyle = pKleur;
        ctx.fillRect (10*pX,10*pY,10,10);
    }
}
function veldBezocht(pX, pY) { kleurVeld(pX,pY,"rgba(223,0,0,0.5)"); }
function veldKruimelpad(pX, pY) { kleurVeld(pX,pY,"rgba(0,195,0,0.5)"); }
