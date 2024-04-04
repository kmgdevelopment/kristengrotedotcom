<?php 

function Taglist($heading, $tags) {
    $listItems = '';

    foreach($tags as $item) {
        $dataName = strtolower($item);
        $dataName = preg_replace('/( |\/|\.)/', '-', $dataName);
        $listItems .= "<li data-tag=\"${dataName}\">{$item}</li>";
    }
    
    return "
        <div class=\"taglist\">
            <h6 class=\"h\">{$heading}</h6>
            <ul>
                {$listItems}
            </ul>
        </div>
    ";
}

