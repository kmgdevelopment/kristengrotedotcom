<?php 
require_once __DIR__ . "/../taglist/taglist.php";
require_once __DIR__ . "/../profile/profile.php";
require_once __DIR__ . "/../accordion/accordion.php";
require_once __DIR__ . "/../page-intro/page-intro.php";

function GlobalHeader($pageIntro) {
    $tagLists = array(
        0 => array(
            'heading' => "Languages & Frameworks",
            'tags' => [
                'HTML5',
                'CSS3',
                'Javascript/ES6',
                'SASS/SCSS',
                'Typescript',
                'React',
                'Next.js',
                'React Query',
                'jQuery',
                'Bootstrap',
                'Twig',
                'Handlebars',
                'Craft CMS',
                'ExpressionEngine'
            ]
        ),
        1 => array(
            'heading' => "Server-Side Programs",
            'tags' => [
                'NPM',
                'Git',
                'Webpack',
                'Grunt',
                'Babel',
                'ESLint',
                'Prettier',
                'DDEV'
            ]
        ),
        2 => array(
            'heading' => "Principles",
            'tags' => [
                'Responsive Design',
                'HTML Email Development',
                'Mobile-First Web Development',
                'Component-Based Architecture',
                'Headless CMS Development',
                'Page Speed Optimization',
                'Progressive Enhancement'
            ]
        ),
        3 => array(
            'heading' => "Software",
            'tags' => [
                'Adobe Photoshop',
                'Adobe Illustrator',
                'Sketch',
                'Figma',
                'Visual Studio Code',
                'Sublime Text'
            ]
        )
    );

    $listOfTagLists = array_map(function($tagList) {
        return "<section>" . Taglist($tagList['heading'], $tagList['tags']) . "</section>";
    }, $tagLists);

    $listOfTagListsHTML = join("\n", $listOfTagLists);
    
    $accordionData = array(
        0 => array(
            'label' => 'View Skills List',
            'content' => "
                <div class=\"section-set\">
                    ${listOfTagListsHTML}
                </div>
            "
        )
    );

    $Accordion = Accordion($accordionData);
    $Profile = Profile();
    $PageIntro = PageIntro("<p>${pageIntro}</p>");

    return "
        <header class=\"global-header\">
            <div class=\"section-set\">
                <section>
                    ${Profile}
                </section>
                <section>
                    ${PageIntro}
                </section>
                <section>
                    ${Accordion}
                </section>
            </div>
        </header>
    ";
}
