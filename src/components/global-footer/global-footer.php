<?php

function GlobalFooter() {
    $currentYear = date('Y');

    return "
        <footer class=\"global-footer\">
            <p class=\"copyright\">&copy; ${currentYear} Kristen Grote</p>
            <p class=\"view-source\">
                <a href=\"https://github.com/kmgdevelopment/kristengrotedotcom\">
                    <svg aria-hidden=\"true\"><use href=\"/assets/img/ui/icons/social/symbol-defs.svg#icon-github\"></svg>
                    View Source
                </a>
            </p>
        </footer>

        <div id=\"media\" aria-hidden=\"true\"></div>
    ";
}