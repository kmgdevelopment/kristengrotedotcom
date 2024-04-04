import accordion from "../plugins/accordion";
import scrollTrigger from "../plugins/scroll-trigger";
import tagHighlight from "../plugins/tag-highlight";
import newWindowLink from "../plugins/new-window-link";

export default function Home() {
    const root = document.documentElement;
    const media = document.getElementById('media');

    // Accordions
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach( (element) => {
        accordion(element);
    });

    // Off-Site Links
    const pageLinks = Array.from(document.querySelectorAll('a'));
    if(pageLinks) {
        newWindowLink(pageLinks);
    }
    
    // Scroll Effects
    const scrollTriggerElements: HTMLElement[] = Array.from(document.querySelectorAll('.layout-home-main .featured-project'));
    const headerTagList: HTMLElement[] = Array.from(document.querySelectorAll('.global-header .taglist li'));
    const defaultHue = root.style.getPropertyValue('--template-hue');

    scrollTrigger({
        elementList: scrollTriggerElements,
        toggleFunc: (currentElement) => {
            // change template color
            const elementHue = currentElement.dataset.hue;
            if(elementHue) {
                root.style.setProperty('--template-hue', elementHue);
            }
            
            // highlight tags (large screens only)
            if(media) {
                const mediaSize = window.getComputedStyle(media).getPropertyValue('font-family');
                if(mediaSize != 'small' && mediaSize != 'medium') {
                    tagHighlight(currentElement, headerTagList);
                }
            }

        },
        singleFunc: (currentElement) => {
            // play da video
            const elementVideo = currentElement.classList.contains('video');
            if(elementVideo) {
                const htmlVideo = currentElement.querySelector('video');

                if(htmlVideo && htmlVideo.paused && !htmlVideo.ended) {
                    htmlVideo.play();
                }
            }
        },
        resetFunc: () => {
            // set template hue back to default
            root.style.setProperty("--template-hue", defaultHue);
            // un-disable all header tags
            headerTagList.forEach( (tag) => {
                if(tag.classList.contains('disabled')) {
                    tag.classList.remove('disabled');
                }
            } );
        }
    });

}