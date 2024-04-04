<?php

function Profile() {
    return "
        <div class=\"profile\">
            <div class=\"media\">
                <picture>
                    <source
                        srcset=\"/assets/img/kristen-grote-avatar_l_2x.webp 2x\"
                        media=\"(min-width: 1025px)\"
                    >
                    <source
                        srcset=\"/assets/img/kristen-grote-avatar_l.webp\"
                        media=\"(min-width: 1025px)\"
                    >
                    <source
                        srcset=\"/assets/img/kristen-grote-avatar_2x.webp 2x\"
                        media=\"(max-width: 1024px)\"
                    >
                    <img 
                        src=\"/assets/img/kristen-grote-avatar.webp\" 
                        alt=\"Kristen Grote\" 
                        width=\"150\"
                        height=\"150\"
                    />
                </picture>
            </div>
            <div class=\"text\">
                <h1 class=\"h\">Kristen Grote</h1>
                <h2 class=\"subhead\">Front-End Web Developer</h2>
        
                <div class=\"socials\">
                    <ul>
                        <li>
                            <a href=\"https://www.linkedin.com/in/kristengrote/\">
                                <span class=\"visually-hidden\">LinkedIn</span>
                                <svg aria-hidden=\"true\"><use xlink:href=\"/assets/img/ui/icons/social/symbol-defs.svg#icon-linkedin\"></use></svg>
                            </a>
                        </li>
                        <li>
                            <a href=\"https://github.com/kmgdevelopment\">
                                <span class=\"visually-hidden\">GitHub</span>
                                <svg aria-hidden=\"true\"><use xlink:href=\"/assets/img/ui/icons/social/symbol-defs.svg#icon-github\"></use></svg>
                            </a>
                        </li>
                        <li>
                            <a href=\"https://stackoverflow.com/users/532742/kmgdev\">
                                <span class=\"visually-hidden\">Stack Overflow</span>
                                <svg aria-hidden=\"true\"><use xlink:href=\"/assets/img/ui/icons/social/symbol-defs.svg#icon-stackoverflow\"></use></svg>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    ";
}