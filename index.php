<!DOCTYPE html>
<html>
<head>
  <title>iKadaster</title>
</head>
<body>
<?php
    function echoURL($pURL, $pTekst = '', $pHrefExtra = '') {
        $lTekst = ($pTekst == '') ? $pURL : $pTekst;
        echo "\n    <li>";
        echo "\n      " . sprintf('<a href="%s"%s>%s</a>', $pURL, $pHrefExtra, $lTekst);
        echo "\n    </li>";
    }
    function ProgrammaLijst() {
        $lURLs = array();
        $handle=opendir(".");
        $projectContents = '';
        while (($file = readdir($handle))!==false)
            if ((substr($file,-5) == '.html' || substr($file,-4) == '.php') && $file <> 'index.php')
                // echo "\n<br />" . $file;                     
                $lURLs[] = $file;
        closedir($handle);
        asort($lURLs);
        echo "\n<ul>";
            foreach ($lURLs as $rURL) echoURL($rURL);
        echo "\n</ul>";
    }
    { ProgrammaLijst(); }
?>
</body>
