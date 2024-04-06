interface ScrollTrigger {
    // list of elements that trigger an effect
    // when they enter the viewport threshold
    elementList: HTMLElement[],
    // effects that toggle depending 
    // on the currently active section
    toggleFunc: (currentElement: HTMLElement) => void,
    // effects that only trigger once when the user scrolls down
    singleFunc: (currentElement: HTMLElement) => void,
    // reset effects when the user returns to the top
    resetFunc: () => void
}

export default function scrollTrigger(options: ScrollTrigger) {
    const resetThreshold = 20;
    let currentSection: HTMLElement | undefined;
    
    let scrollTriggerSections = options.elementList.map( (element) => {
        return {
            element: element,
            singleEffectsTriggered: false
        }
    });    

    let viewportThreshold = document.documentElement.clientHeight / 2;
    window.addEventListener('resize', () => {
        viewportThreshold = document.documentElement.clientHeight / 2;
    });

    window.addEventListener('scroll', () => {
        // don't activate the sparkles until the user
        // starts scrolling / reset to default if they
        // scroll back to the top
        if(window.scrollY <= resetThreshold && currentSection !== undefined) {
            options.resetFunc();
            currentSection = undefined;
        } 
        
        // ** S~P~A~R~K~L~E~S **
        else {
            scrollTriggerSections.forEach( (section) => {
                if(section.element !== currentSection) {
                    const topPos = section.element.getBoundingClientRect().top;
                    const bottomPos = section.element.getBoundingClientRect().bottom;
        
                    // re-run these effects every 
                    // time the section comes into view (scroll down & reverse)
                    if(
                        window.scrollY > resetThreshold 
                        && topPos <= viewportThreshold 
                        && bottomPos > viewportThreshold
                    ) {
                        options.toggleFunc(section.element);
                        
                        // set this as the current section
                        currentSection = section.element;
                    }
        
                    // only run these effects once 
                    // when the section comes into view (scroll down only)
                    if(
                        window.scrollY > resetThreshold
                        && !section.singleEffectsTriggered 
                        && topPos <= viewportThreshold
                    ) {
                        options.singleFunc(section.element);
        
                        section.singleEffectsTriggered = true;
                    }
                }
            } );
        }
    });

}