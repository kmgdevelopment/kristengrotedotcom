export default function accordion(elem: Element) {
    if(elem) {
        const control: HTMLButtonElement | null  = elem.querySelector('.accordion-control button');
        const body: Element | null = elem.querySelector('.accordion-body');
        let isOpen = false;

        if( control && body ) {
            const controlArrow = control.querySelector('span');

            control.addEventListener('click', function(){
                isOpen = !isOpen;

                if(isOpen) {
                    body.classList.add('open');
                    if(controlArrow) {
                        controlArrow.innerHTML = '-';
                    }
                    
                }
                else {
                    body.classList.remove('open');
                    if(controlArrow) {
                        controlArrow.innerHTML = '+';
                    }
                }
            });
        }
    }
}