<!DOCTYPE html>
<html>
<head>
    <title>scrum-checklists</title>
    <link   href="scrum-checklists.css" type="text/css" rel="stylesheet" />
    <script src ="scrum-checklists.js"  type="text/javascript" ></script>
</head>
<body onload="Init()">
<?php
    function echoRegel($pRegel) {
        static $lWitruimte = 0;
        if (substr($pRegel, 0, 4) == '<div' ) $lWitruimte++;
        if (substr($pRegel, 0, 5) == '<form') $lWitruimte++;
        echo str_pad("\n", 1 + 2*$lWitruimte) . $pRegel;
        if (substr($pRegel, 0, 2) == '</'   ) $lWitruimte--;
        if ($lWitruimte < 0) $lWitruimte = 0;
    }
    class cVeld {
        public static $Velden = array();
        private $Lijst;
        private $Naam;
        private $Prompt;
        function __construct($pLijst, $pNaam, $pPrompt) {
            self::$Velden[] = $this;
            $this->Lijst  = $pLijst;
            $this->Naam   = $pNaam;
            $this->Prompt = $pPrompt;
        }
        function InLijst($pLijst) { return $this->Lijst == $pLijst; }
        function GetHTML() {
            $lPromptID = sprintf('data-%s-prompt', $this->Lijst);
            $lParams = array();
            $lParams['type'    ] = 'checkbox';
            $lParams['name'    ] = $this->Lijst . '-' . $this->Naam;
            $lParams['id'      ] = $this->Lijst . '-' . $this->Naam;
            $lParams[$lPromptID] = $this->Prompt;
            $lParams['class'   ] = 'squaredTwo';
            $lParams['onclick' ] = 'VulChecklists();';
            $lInput = '<input';
            foreach ($lParams as $kParam => $rParam) $lInput .= sprintf(' %s="%s"', $kParam, $rParam);
            // $lInput .= ' checked';
            $lInput .= ' />';
            return sprintf('<br />%s<big> %s</big>', $lInput, $this->Prompt);
        }
    }
    function InitVelden() {
        new cVeld('dor', 'duidelijk-omschreven'    , 'Voldoende duidelijk');
        new cVeld('dor', 'description-volledig'    , 'Description klopt');
        new cVeld('dor', 'epic-gekoppeld'          , 'Epic gekoppeld');
        new cVeld('dor', 'baten-kosten-analyse'    , 'Baten helder');
        new cVeld('dor', 'business-value'          , 'Belang bekend: Business Value');
        new cVeld('dor', 'story-points-toegekend'  , 'Schatting gemaakt: Story Points');
        new cVeld('dor', 'lvb-scrumteam-concensus' , 'Concensus');
        //
        new cVeld('dod', 'story-definition-of-done', 'Story Definition of Done');
        new cVeld('dod', 'product-owner-tevreden'  , 'Fiat Product Owner'  );
        new cVeld('dod', 'review-gehouden'         , 'Demo + Review'  );
        new cVeld('dod', 'besluiten-geborgd'       , 'Besluiten geborgd'  );
        new cVeld('dod', 'vervolgacties-backlog'   , 'Vervolgacties gebacklogd'  );
        new cVeld('dod', 'ota-test-succesvol'      , 'OTA-Test succesvol'  );
        new cVeld('dod', 'testverslag-naar-po'     , 'Testverslag ontvangen'  );
        new cVeld('dod', 'github-bijgewerkt'       , 'GitHub gevuld'  );
        new cVeld('dod', 'documentie-bijgewerkt'   , 'Documentatie bijgewerkt' );
        new cVeld('dod', 'belanghebbenden-opgeleid', 'Belanghebbenden opgeleid'  );
        new cVeld('dod', 'release-gepland'         , 'Release gepland'         );
        new cVeld('dod', 'releaseplanning-bekend'  , 'Releaseplanning gecommuniceerd'               );
        new cVeld('dod', 'wont-fix'                , 'Won\'t Fix'              );
        new cVeld('dod', 'lvb-scrumteam-concensus' , 'Concensus'               );
    }
    function ToonVelden() {
        foreach (array('dor','dod') as $rLijst) {
            echoRegel(sprintf('<div id="%s" class="clear">', $rLijst));
            echoRegel('<div class="floatleft">');
            echoRegel(sprintf('<h2>Definition of %s</h2>', ($rLijst == 'dor') ? 'Ready' : 'Done'));
            echoRegel(sprintf('<textarea id="%s-tekst" name="%s-tekst" cols="50" rows="20" ></textarea>', $rLijst, $rLijst));
            echoRegel('</div>');
            echoRegel('<div class="floatleft">');
            echoRegel('<h2>Checklist</h2>');
            echoRegel(sprintf('<form id="%s-vakjes">', $rLijst));
            foreach (cVeld::$Velden as $rVeld) if ($rVeld->InLijst($rLijst)) echoRegel($rVeld->GetHTML());
            echoRegel('</form>');
            echoRegel('</div>');
            echoRegel('</div>');
        }
    }
    {
        InitVelden();
        ToonVelden();
    }
?>
</body>
</html>