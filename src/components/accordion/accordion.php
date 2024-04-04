<?php

function Accordion($data) {
    $segments = array_map(function($item) {
        $control = $item['label'];
        $content = $item['content'];
        return "
            <div class=\"accordion-control\">
                <button>${control} <span>+</span></button>
            </div>
            <div class=\"accordion-body\">
                <div class=\"accordion-body-content\">
                    ${content}
                </div>
            </div>
        ";
    }, $data);

    $segmentsHTML = join("\n", $segments);

    return "
        <div class=\"accordion\">
            <div class=\"accordion-item\">
                ${segmentsHTML}
            </div>
        </div>
    ";
}