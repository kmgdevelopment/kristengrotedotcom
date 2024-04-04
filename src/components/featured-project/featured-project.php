<?php

require_once __DIR__ . "/../header-highlight/header-highlight.php";
require_once __DIR__ . "/../taglist/taglist.php";

function FeaturedProject($options) {
    $heading = $options['heading'];
    $hue = $options['hue'];
    $summary = $options['summary'];
    $skillsList = $options['skillsList'];
    $videoFilename = $options['videoFilename'] ?? false;
    $desktopImgName = $options['desktopImgName'] ?? false;
    $mobileImgName = $options['mobileImgName'];
    $sourceUrl = $options['sourceUrl'] ?? false;
    $liveUrl = $options['liveUrl'] ?? false;
    $layout = $options['layout'] ?? false;
    $lazyload = $options['lazyload'] ?? false;

    $loading = $lazyload ? 'lazy' : 'eager';

    $Header = HeaderHighlight($heading, "Featured Project");
    $Taglist = Taglist('Skills Used:', $skillsList);

    // HTML Classes
    $classList = ['featured-project'];
    $videoFilename && ($classList[] = 'video');
    $layout && ($classList[] = $layout);
    $classes = join(' ', $classList);

    // Tags data attribute
    $tagData = array_map( function($item) {
        $dataName = strtolower($item);
        $dataName = preg_replace('/( |\/|\.)/', '-', $dataName);
        return $dataName;
    }, $skillsList );
    $tagDataAttr = join(',', $tagData);

    $linkHTML = '';
    if($sourceUrl && $liveUrl) {
        $linkHTML = "
            <ul class=\"links\">
                <li><a href=\"${liveUrl}\">
                    <svg><use href=\"/assets/img/ui/icons/global/symbol-defs.svg#icon-open\"></svg>
                    See it Live
                </a></li>
                <li><a href=\"${sourceUrl}\">
                <svg><use href=\"/assets/img/ui/icons/social/symbol-defs.svg#icon-github\"></svg>
                    View Source
                </a></li>
            </ul>
        ";
    }

    $videoTag = '';
    if($videoFilename) {
        $videoTag = "
            <video
                muted
                playsinline
                preload=\"auto\"
                poster=\"/assets/img/ui/video-poster.webp\"
                title=\"${heading} interactions on desktop\"
            >
                <source src=\"/assets/img/${videoFilename}.webm\" type=\"video/webm\">
                <source src=\"/assets/img/${videoFilename}.mp4\" type=\"video/mp4\">
            </video>
        ";
    }

    $desktopTag = '';
    if($desktopImgName) {
        $desktopTag = "
            <picture>
                <source
                    srcset=\"/assets/img/${desktopImgName}_l_2x.webp 2x\"
                    media=\"(min-width: 768px)\"
                />
                <source
                    srcset=\"/assets/img/${desktopImgName}_l.webp\"
                    media=\"(min-width: 768px)\"
                />
                <source
                    srcset=\"/assets/img/${desktopImgName}_2x.webp 2x\"
                    media=\"(max-width: 767px)\"
                />
                <img 
                    src=\"/assets/img/${desktopImgName}.webp\" 
                    alt=\"${heading} on desktop\"
                    width=\"320\"
                    height=\"180\"
                    loading=\"${loading}\"
                />
            </picture>
        ";
    }

    $desktopMedia = $videoFilename ? $videoTag : $desktopTag;

    return "
        <div 
            class=\"${classes}\" 
            data-hue=\"${hue}\"
            data-tags=\"${tagDataAttr}\"
        >
            <section>
                ${Header}

                <div class=\"devices\">
                    <div class=\"desktop\">
                        ${desktopMedia}
                    </div>
                    <div class=\"mobile\">
                        <picture>
                            <source
                                srcset=\"/assets/img/${mobileImgName}_l_2x.webp 2x\"
                                media=\"(min-width: 412px)\"
                            />
                            <source
                                srcset=\"/assets/img/${mobileImgName}_l.webp\"
                                media=\"(min-width: 412px)\"
                            />
                            <source
                                srcset=\"/assets/img/${mobileImgName}_2x.webp 2x\"
                                media=\"(max-width: 411px)\"
                            />
                            <img 
                                src=\"/assets/img/${mobileImgName}.webp\" 
                                alt=\"${heading} on tablet and phone\"
                                width=\"264\"
                                height=\"270\"
                                loading=\"${loading}\"
                            />
                        </picture>
                    </div>
                </div>
            </section>
            <section>
                <div class=\"summary\">
                    <p>${summary}</p>
                    ${linkHTML}
                </div>
            </section>
            <section>
                ${Taglist}
            </section>
        </div>
    ";
}