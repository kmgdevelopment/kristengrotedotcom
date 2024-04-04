export default function tagHighlight(element: HTMLElement, taglist: NodeList | HTMLElement[]) {
    const elementTags: string[] | undefined = element.dataset.tags?.split(',');

    if(elementTags) {
        // for each tag in the taglist, check if it
        // matches the given element tags
        taglist.forEach( (tag) => {
            const tagElement = tag as HTMLElement;
            const tagName = tagElement.dataset.tag;

            if(tagName) {
                // disable the tag if no match is found
                if(!elementTags.includes(tagName)) {
                    tagElement.classList.add('disabled');
                }
                // un-disable if match is found
                else if(elementTags.includes(tagName) && tagElement.classList.contains('disabled')) {
                    tagElement.classList.remove('disabled');
                }
            }
        });
    }
}



