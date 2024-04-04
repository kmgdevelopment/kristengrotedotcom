(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accordion_1 = require("../plugins/accordion");
const scroll_trigger_1 = require("../plugins/scroll-trigger");
const tag_highlight_1 = require("../plugins/tag-highlight");
const new_window_link_1 = require("../plugins/new-window-link");
function Home() {
    const root = document.documentElement;
    const media = document.getElementById('media');
    // Accordions
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach((element) => {
        (0, accordion_1.default)(element);
    });
    // Off-Site Links
    const pageLinks = Array.from(document.querySelectorAll('a'));
    if (pageLinks) {
        (0, new_window_link_1.default)(pageLinks);
    }
    // Scroll Effects
    const scrollTriggerElements = Array.from(document.querySelectorAll('.layout-home-main .featured-project'));
    const headerTagList = Array.from(document.querySelectorAll('.global-header .taglist li'));
    const defaultHue = root.style.getPropertyValue('--template-hue');
    (0, scroll_trigger_1.default)({
        elementList: scrollTriggerElements,
        toggleFunc: (currentElement) => {
            // change template color
            const elementHue = currentElement.dataset.hue;
            if (elementHue) {
                root.style.setProperty('--template-hue', elementHue);
            }
            // highlight tags (large screens only)
            if (media) {
                const mediaSize = window.getComputedStyle(media).getPropertyValue('font-family');
                if (mediaSize != 'small' && mediaSize != 'medium') {
                    (0, tag_highlight_1.default)(currentElement, headerTagList);
                }
            }
        },
        singleFunc: (currentElement) => {
            // play da video
            const elementVideo = currentElement.classList.contains('video');
            if (elementVideo) {
                const htmlVideo = currentElement.querySelector('video');
                if (htmlVideo && htmlVideo.paused && !htmlVideo.ended) {
                    htmlVideo.play();
                }
            }
        },
        resetFunc: () => {
            // set template hue back to default
            root.style.setProperty("--template-hue", defaultHue);
            // un-disable all header tags
            headerTagList.forEach((tag) => {
                if (tag.classList.contains('disabled')) {
                    tag.classList.remove('disabled');
                }
            });
        }
    });
}
exports.default = Home;

},{"../plugins/accordion":3,"../plugins/new-window-link":4,"../plugins/scroll-trigger":5,"../plugins/tag-highlight":6}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const home_1 = require("./components/home");
(0, home_1.default)();

},{"./components/home":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function accordion(elem) {
    if (elem) {
        const control = elem.querySelector('.accordion-control button');
        const body = elem.querySelector('.accordion-body');
        let isOpen = false;
        if (control && body) {
            const controlArrow = control.querySelector('span');
            control.addEventListener('click', function () {
                isOpen = !isOpen;
                if (isOpen) {
                    body.classList.add('open');
                    if (controlArrow) {
                        controlArrow.innerHTML = '-';
                    }
                }
                else {
                    body.classList.remove('open');
                    if (controlArrow) {
                        controlArrow.innerHTML = '+';
                    }
                }
            });
        }
    }
}
exports.default = accordion;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// open remote or PDF links in a new window
function newWindowLink(links) {
    const pdfRegex = new RegExp(/.pdf$/);
    links.forEach((link) => {
        if (
        // if the href is a remote host or a pdf file
        (link.host != window.location.host || pdfRegex.test(link.href))
            // does not have a "notremote" class
            && !link.classList.contains('notremote')
            // does not trigger a modal window
            && !link.dataset.modal) {
            // open in a new window
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(link.href, '_blank');
            });
        }
    });
}
exports.default = newWindowLink;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function scrollTrigger(options) {
    let currentSection;
    let scrollTriggerSections = options.elementList.map((element) => {
        return {
            element: element,
            singleEffectsTriggered: false
        };
    });
    let viewportThreshold = document.documentElement.clientHeight / 2;
    window.addEventListener('resize', () => {
        viewportThreshold = document.documentElement.clientHeight / 2;
    });
    window.addEventListener('scroll', () => {
        // don't activate the sparkles until the user
        // starts scrolling / reset to default if they
        // scroll back to the top
        if (window.scrollY <= 20 && currentSection !== undefined) {
            options.resetFunc();
            currentSection = undefined;
        }
        // ** S~P~A~R~K~L~E~S **
        else {
            scrollTriggerSections.forEach((section) => {
                if (section.element !== currentSection) {
                    const topPos = section.element.getBoundingClientRect().top;
                    const bottomPos = section.element.getBoundingClientRect().bottom;
                    // re-run these effects every 
                    // time the section comes into view (scroll down & reverse)
                    if (topPos <= viewportThreshold && bottomPos > viewportThreshold) {
                        options.toggleFunc(section.element);
                        // set this as the current section
                        currentSection = section.element;
                    }
                    // only run these effects once 
                    // when the section comes into view (scroll down only)
                    if (!section.singleEffectsTriggered && topPos <= viewportThreshold) {
                        options.singleFunc(section.element);
                        section.singleEffectsTriggered = true;
                    }
                }
            });
        }
    });
}
exports.default = scrollTrigger;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function tagHighlight(element, taglist) {
    var _a;
    const elementTags = (_a = element.dataset.tags) === null || _a === void 0 ? void 0 : _a.split(',');
    if (elementTags) {
        // for each tag in the taglist, check if it
        // matches the given element tags
        taglist.forEach((tag) => {
            const tagElement = tag;
            const tagName = tagElement.dataset.tag;
            if (tagName) {
                // disable the tag if no match is found
                if (!elementTags.includes(tagName)) {
                    tagElement.classList.add('disabled');
                }
                // un-disable if match is found
                else if (elementTags.includes(tagName) && tagElement.classList.contains('disabled')) {
                    tagElement.classList.remove('disabled');
                }
            }
        });
    }
}
exports.default = tagHighlight;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29tcG9uZW50cy9ob21lLnRzIiwic3JjL2pzL21haW4udHMiLCJzcmMvanMvcGx1Z2lucy9hY2NvcmRpb24udHMiLCJzcmMvanMvcGx1Z2lucy9uZXctd2luZG93LWxpbmsudHMiLCJzcmMvanMvcGx1Z2lucy9zY3JvbGwtdHJpZ2dlci50cyIsInNyYy9qcy9wbHVnaW5zL3RhZy1oaWdobGlnaHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLG9EQUE2QztBQUM3Qyw4REFBc0Q7QUFDdEQsNERBQW9EO0FBQ3BELGdFQUF1RDtBQUV2RCxTQUF3QixJQUFJO0lBQ3hCLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUM7SUFDdEMsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUUvQyxhQUFhO0lBQ2IsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzNELFVBQVUsQ0FBQyxPQUFPLENBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRTtRQUM1QixJQUFBLG1CQUFTLEVBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFFSCxpQkFBaUI7SUFDakIsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM3RCxJQUFHLFNBQVMsRUFBRSxDQUFDO1FBQ1gsSUFBQSx5QkFBYSxFQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxpQkFBaUI7SUFDakIsTUFBTSxxQkFBcUIsR0FBa0IsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMscUNBQXFDLENBQUMsQ0FBQyxDQUFDO0lBQzFILE1BQU0sYUFBYSxHQUFr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LFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO29CQUNoQyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDekMsQ0FBQztnQkFDRCwrQkFBK0I7cUJBQzFCLElBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO29CQUNqRixVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDNUMsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7QUFDTCxDQUFDO0FBdEJELCtCQXNCQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBhY2NvcmRpb24gZnJvbSBcIi4uL3BsdWdpbnMvYWNjb3JkaW9uXCI7XG5pbXBvcnQgc2Nyb2xsVHJpZ2dlciBmcm9tIFwiLi4vcGx1Z2lucy9zY3JvbGwtdHJpZ2dlclwiO1xuaW1wb3J0IHRhZ0hpZ2hsaWdodCBmcm9tIFwiLi4vcGx1Z2lucy90YWctaGlnaGxpZ2h0XCI7XG5pbXBvcnQgbmV3V2luZG93TGluayBmcm9tIFwiLi4vcGx1Z2lucy9uZXctd2luZG93LWxpbmtcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSG9tZSgpIHtcbiAgICBjb25zdCByb290ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIGNvbnN0IG1lZGlhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lZGlhJyk7XG5cbiAgICAvLyBBY2NvcmRpb25zXG4gICAgY29uc3QgYWNjb3JkaW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24nKTtcbiAgICBhY2NvcmRpb25zLmZvckVhY2goIChlbGVtZW50KSA9PiB7XG4gICAgICAgIGFjY29yZGlvbihlbGVtZW50KTtcbiAgICB9KTtcblxuICAgIC8vIE9mZi1TaXRlIExpbmtzXG4gICAgY29uc3QgcGFnZUxpbmtzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhJykpO1xuICAgIGlmKHBhZ2VMaW5rcykge1xuICAgICAgICBuZXdXaW5kb3dMaW5rKHBhZ2VMaW5rcyk7XG4gICAgfVxuICAgIFxuICAgIC8vIFNjcm9sbCBFZmZlY3RzXG4gICAgY29uc3Qgc2Nyb2xsVHJpZ2dlckVsZW1lbnRzOiBIVE1MRWxlbWVudFtdID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubGF5b3V0LWhvbWUtbWFpbiAuZmVhdHVyZWQtcHJvamVjdCcpKTtcbiAgICBjb25zdCBoZWFkZXJUYWdMaXN0OiBIVE1MRWxlbWVudFtdID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZ2xvYmFsLWhlYWRlciAudGFnbGlzdCBsaScpKTtcbiAgICBjb25zdCBkZWZhdWx0SHVlID0gcm9vdC5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCctLXRlbXBsYXRlLWh1ZScpO1xuXG4gICAgc2Nyb2xsVHJpZ2dlcih7XG4gICAgICAgIGVsZW1lbnRMaXN0OiBzY3JvbGxUcmlnZ2VyRWxlbWVudHMsXG4gICAgICAgIHRvZ2dsZUZ1bmM6IChjdXJyZW50RWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgLy8gY2hhbmdlIHRlbXBsYXRlIGNvbG9yXG4gICAgICAgICAgICBjb25zdCBlbGVtZW50SHVlID0gY3VycmVudEVsZW1lbnQuZGF0YXNldC5odWU7XG4gICAgICAgICAgICBpZihlbGVtZW50SHVlKSB7XG4gICAgICAgICAgICAgICAgcm9vdC5zdHlsZS5zZXRQcm9wZXJ0eSgnLS10ZW1wbGF0ZS1odWUnLCBlbGVtZW50SHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gaGlnaGxpZ2h0IHRhZ3MgKGxhcmdlIHNjcmVlbnMgb25seSlcbiAgICAgICAgICAgIGlmKG1lZGlhKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVkaWFTaXplID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUobWVkaWEpLmdldFByb3BlcnR5VmFsdWUoJ2ZvbnQtZmFtaWx5Jyk7XG4gICAgICAgICAgICAgICAgaWYobWVkaWFTaXplICE9ICdzbWFsbCcgJiYgbWVkaWFTaXplICE9ICdtZWRpdW0nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhZ0hpZ2hsaWdodChjdXJyZW50RWxlbWVudCwgaGVhZGVyVGFnTGlzdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG4gICAgICAgIHNpbmdsZUZ1bmM6IChjdXJyZW50RWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgLy8gcGxheSBkYSB2aWRlb1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudFZpZGVvID0gY3VycmVudEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCd2aWRlbycpO1xuICAgICAgICAgICAgaWYoZWxlbWVudFZpZGVvKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaHRtbFZpZGVvID0gY3VycmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcigndmlkZW8nKTtcblxuICAgICAgICAgICAgICAgIGlmKGh0bWxWaWRlbyAmJiBodG1sVmlkZW8ucGF1c2VkICYmICFodG1sVmlkZW8uZW5kZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaHRtbFZpZGVvLnBsYXkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlc2V0RnVuYzogKCkgPT4ge1xuICAgICAgICAgICAgLy8gc2V0IHRlbXBsYXRlIGh1ZSBiYWNrIHRvIGRlZmF1bHRcbiAgICAgICAgICAgIHJvb3Quc3R5bGUuc2V0UHJvcGVydHkoXCItLXRlbXBsYXRlLWh1ZVwiLCBkZWZhdWx0SHVlKTtcbiAgICAgICAgICAgIC8vIHVuLWRpc2FibGUgYWxsIGhlYWRlciB0YWdzXG4gICAgICAgICAgICBoZWFkZXJUYWdMaXN0LmZvckVhY2goICh0YWcpID0+IHtcbiAgICAgICAgICAgICAgICBpZih0YWcuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhZy5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG59IiwiaW1wb3J0IEhvbWUgZnJvbSAnLi9jb21wb25lbnRzL2hvbWUnO1xuXG5Ib21lKCk7IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWNjb3JkaW9uKGVsZW06IEVsZW1lbnQpIHtcbiAgICBpZihlbGVtKSB7XG4gICAgICAgIGNvbnN0IGNvbnRyb2w6IEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbCAgPSBlbGVtLnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb24tY29udHJvbCBidXR0b24nKTtcbiAgICAgICAgY29uc3QgYm9keTogRWxlbWVudCB8IG51bGwgPSBlbGVtLnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb24tYm9keScpO1xuICAgICAgICBsZXQgaXNPcGVuID0gZmFsc2U7XG5cbiAgICAgICAgaWYoIGNvbnRyb2wgJiYgYm9keSApIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xBcnJvdyA9IGNvbnRyb2wucXVlcnlTZWxlY3Rvcignc3BhbicpO1xuXG4gICAgICAgICAgICBjb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpc09wZW4gPSAhaXNPcGVuO1xuXG4gICAgICAgICAgICAgICAgaWYoaXNPcGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xuICAgICAgICAgICAgICAgICAgICBpZihjb250cm9sQXJyb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xBcnJvdy5pbm5lckhUTUwgPSAnLSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoY29udHJvbEFycm93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sQXJyb3cuaW5uZXJIVE1MID0gJysnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLy8gb3BlbiByZW1vdGUgb3IgUERGIGxpbmtzIGluIGEgbmV3IHdpbmRvd1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbmV3V2luZG93TGluayhsaW5rczogSFRNTEFuY2hvckVsZW1lbnRbXSkge1xuICAgIGNvbnN0IHBkZlJlZ2V4ID0gbmV3IFJlZ0V4cCgvLnBkZiQvKTtcblxuICAgIGxpbmtzLmZvckVhY2goIChsaW5rKSA9PiB7ICAgICAgICBcbiAgICAgICAgaWYoXG4gICAgICAgICAgICAvLyBpZiB0aGUgaHJlZiBpcyBhIHJlbW90ZSBob3N0IG9yIGEgcGRmIGZpbGVcbiAgICAgICAgICAgICggbGluay5ob3N0ICE9IHdpbmRvdy5sb2NhdGlvbi5ob3N0IHx8IHBkZlJlZ2V4LnRlc3QobGluay5ocmVmKSApXG4gICAgICAgICAgICAvLyBkb2VzIG5vdCBoYXZlIGEgXCJub3RyZW1vdGVcIiBjbGFzc1xuICAgICAgICAgICAgJiYgIWxpbmsuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3RyZW1vdGUnKVxuICAgICAgICAgICAgLy8gZG9lcyBub3QgdHJpZ2dlciBhIG1vZGFsIHdpbmRvd1xuICAgICAgICAgICAgJiYgIWxpbmsuZGF0YXNldC5tb2RhbFxuICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIG9wZW4gaW4gYSBuZXcgd2luZG93XG4gICAgICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cub3BlbihsaW5rLmhyZWYsICdfYmxhbmsnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59IiwiaW50ZXJmYWNlIFNjcm9sbFRyaWdnZXIge1xuICAgIC8vIGxpc3Qgb2YgZWxlbWVudHMgdGhhdCB0cmlnZ2VyIGFuIGVmZmVjdFxuICAgIC8vIHdoZW4gdGhleSBlbnRlciB0aGUgdmlld3BvcnQgdGhyZXNob2xkXG4gICAgZWxlbWVudExpc3Q6IEhUTUxFbGVtZW50W10sXG4gICAgLy8gZWZmZWN0cyB0aGF0IHRvZ2dsZSBkZXBlbmRpbmcgXG4gICAgLy8gb24gdGhlIGN1cnJlbnRseSBhY3RpdmUgc2VjdGlvblxuICAgIHRvZ2dsZUZ1bmM6IChjdXJyZW50RWxlbWVudDogSFRNTEVsZW1lbnQpID0+IHZvaWQsXG4gICAgLy8gZWZmZWN0cyB0aGF0IG9ubHkgdHJpZ2dlciBvbmNlIHdoZW4gdGhlIHVzZXIgc2Nyb2xscyBkb3duXG4gICAgc2luZ2xlRnVuYzogKGN1cnJlbnRFbGVtZW50OiBIVE1MRWxlbWVudCkgPT4gdm9pZCxcbiAgICAvLyByZXNldCBlZmZlY3RzIHdoZW4gdGhlIHVzZXIgcmV0dXJucyB0byB0aGUgdG9wXG4gICAgcmVzZXRGdW5jOiAoKSA9PiB2b2lkXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNjcm9sbFRyaWdnZXIob3B0aW9uczogU2Nyb2xsVHJpZ2dlcikge1xuICAgIGxldCBjdXJyZW50U2VjdGlvbjogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG4gICAgXG4gICAgbGV0IHNjcm9sbFRyaWdnZXJTZWN0aW9ucyA9IG9wdGlvbnMuZWxlbWVudExpc3QubWFwKCAoZWxlbWVudCkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZWxlbWVudDogZWxlbWVudCxcbiAgICAgICAgICAgIHNpbmdsZUVmZmVjdHNUcmlnZ2VyZWQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9KTsgICAgXG5cbiAgICBsZXQgdmlld3BvcnRUaHJlc2hvbGQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC8gMjtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgICB2aWV3cG9ydFRocmVzaG9sZCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgLyAyO1xuICAgIH0pO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcbiAgICAgICAgLy8gZG9uJ3QgYWN0aXZhdGUgdGhlIHNwYXJrbGVzIHVudGlsIHRoZSB1c2VyXG4gICAgICAgIC8vIHN0YXJ0cyBzY3JvbGxpbmcgLyByZXNldCB0byBkZWZhdWx0IGlmIHRoZXlcbiAgICAgICAgLy8gc2Nyb2xsIGJhY2sgdG8gdGhlIHRvcFxuICAgICAgICBpZih3aW5kb3cuc2Nyb2xsWSA8PSAyMCAmJiBjdXJyZW50U2VjdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc2V0RnVuYygpO1xuICAgICAgICAgICAgY3VycmVudFNlY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gXG4gICAgICAgIFxuICAgICAgICAvLyAqKiBTflB+QX5Sfkt+TH5FflMgKipcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzY3JvbGxUcmlnZ2VyU2VjdGlvbnMuZm9yRWFjaCggKHNlY3Rpb24pID0+IHtcbiAgICAgICAgICAgICAgICBpZihzZWN0aW9uLmVsZW1lbnQgIT09IGN1cnJlbnRTZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvcFBvcyA9IHNlY3Rpb24uZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJvdHRvbVBvcyA9IHNlY3Rpb24uZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b207XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyByZS1ydW4gdGhlc2UgZWZmZWN0cyBldmVyeSBcbiAgICAgICAgICAgICAgICAgICAgLy8gdGltZSB0aGUgc2VjdGlvbiBjb21lcyBpbnRvIHZpZXcgKHNjcm9sbCBkb3duICYgcmV2ZXJzZSlcbiAgICAgICAgICAgICAgICAgICAgaWYodG9wUG9zIDw9IHZpZXdwb3J0VGhyZXNob2xkICYmIGJvdHRvbVBvcyA+IHZpZXdwb3J0VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnRvZ2dsZUZ1bmMoc2VjdGlvbi5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0IHRoaXMgYXMgdGhlIGN1cnJlbnQgc2VjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFNlY3Rpb24gPSBzZWN0aW9uLmVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgcnVuIHRoZXNlIGVmZmVjdHMgb25jZSBcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiB0aGUgc2VjdGlvbiBjb21lcyBpbnRvIHZpZXcgKHNjcm9sbCBkb3duIG9ubHkpXG4gICAgICAgICAgICAgICAgICAgIGlmKCFzZWN0aW9uLnNpbmdsZUVmZmVjdHNUcmlnZ2VyZWQgJiYgdG9wUG9zIDw9IHZpZXdwb3J0VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNpbmdsZUZ1bmMoc2VjdGlvbi5lbGVtZW50KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWN0aW9uLnNpbmdsZUVmZmVjdHNUcmlnZ2VyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSApO1xuICAgICAgICB9XG4gICAgfSk7XG5cbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0YWdIaWdobGlnaHQoZWxlbWVudDogSFRNTEVsZW1lbnQsIHRhZ2xpc3Q6IE5vZGVMaXN0IHwgSFRNTEVsZW1lbnRbXSkge1xuICAgIGNvbnN0IGVsZW1lbnRUYWdzOiBzdHJpbmdbXSB8IHVuZGVmaW5lZCA9IGVsZW1lbnQuZGF0YXNldC50YWdzPy5zcGxpdCgnLCcpO1xuXG4gICAgaWYoZWxlbWVudFRhZ3MpIHtcbiAgICAgICAgLy8gZm9yIGVhY2ggdGFnIGluIHRoZSB0YWdsaXN0LCBjaGVjayBpZiBpdFxuICAgICAgICAvLyBtYXRjaGVzIHRoZSBnaXZlbiBlbGVtZW50IHRhZ3NcbiAgICAgICAgdGFnbGlzdC5mb3JFYWNoKCAodGFnKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0YWdFbGVtZW50ID0gdGFnIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgY29uc3QgdGFnTmFtZSA9IHRhZ0VsZW1lbnQuZGF0YXNldC50YWc7XG5cbiAgICAgICAgICAgIGlmKHRhZ05hbWUpIHtcbiAgICAgICAgICAgICAgICAvLyBkaXNhYmxlIHRoZSB0YWcgaWYgbm8gbWF0Y2ggaXMgZm91bmRcbiAgICAgICAgICAgICAgICBpZighZWxlbWVudFRhZ3MuaW5jbHVkZXModGFnTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFnRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB1bi1kaXNhYmxlIGlmIG1hdGNoIGlzIGZvdW5kXG4gICAgICAgICAgICAgICAgZWxzZSBpZihlbGVtZW50VGFncy5pbmNsdWRlcyh0YWdOYW1lKSAmJiB0YWdFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICB0YWdFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cblxuXG4iXX0=
