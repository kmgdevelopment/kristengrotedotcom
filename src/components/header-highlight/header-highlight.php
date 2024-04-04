<?php

function HeaderHighlight($heading, $eyebrow) {
    return "
        <div class=\"header-highlight\">
            <small>${eyebrow}</small>
            <h3 class=\"h\">${heading}</h3>
        </div>
    ";
}

