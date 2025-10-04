// open remote or PDF links in a new window
export default function newWindowLink(links: HTMLAnchorElement[]) {
    const pdfRegex = new RegExp(/.pdf$/);

    links.forEach( (link) => {        
        if(
            // if the href is a remote host or a pdf file
            ( link.host != window.location.host || pdfRegex.test(link.href) )
            // does not have a "notremote" class
            && !link.classList.contains('notremote')
            // does not trigger a modal window
            && !link.dataset.modal
        ) {
            // open in a new window
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(link.href, '_blank');
            });
        }
    });
}