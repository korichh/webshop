var StickySidebar = function() {
    // Defaults
    var DEFAULTS = {
        sidebarInner: '.sidebar-inner',
        topGap: 20,
        bottomGap: 20,
    };

    // Parameters
    var sidebar;
    var sidebarInner;
    var topGap;
    var bottomGap;
    var pageScrollX;
    var pageScrollY;
    var sidebarMode;
    var sidebarTopCoord;
    var sidebarBottomCoord;
    var innerTopCoord;
    var innerBottomCoord;
    var currScroll;
    var lastScroll = 0;

    // Functions
    function extend(defaults, options) {
        var results = {};
        for (var key in defaults) {
            if (typeof options[key] !== 'undefined') results[key] = options[key];
            else results[key] = defaults[key];
        }
        return results;
    }

    function getRect(elem) {
        var rect = elem.getBoundingClientRect();
        return {
            top: Math.floor(rect.top + pageScrollY),
            left: Math.floor(rect.left + pageScrollX + 0.5),
            width: elem.offsetWidth - 0.5,
            height: elem.offsetHeight,
        };
    }

    function stylize(elem, {
        position = '',
        width = '',
        top = '',
        bottom = '',
        left = '',
    }) {
        elem.style.position = position;
        elem.style.width = width;
        elem.style.top = top;
        elem.style.bottom = bottom;
        elem.style.left = left;
    }

    // Class definition
    var StickySidebar = function() {
        /**
         * Sticky Sidebar Constructor.
         * @constructor
         * @param {HTMLElement|String} selector - The sidebar element or sidebar selector.
         * @param {Object} options - The options of sticky sidebar.
         */
        function StickySidebar(selector) {
            this.sidebar = typeof selector === 'string' ? document.querySelector(selector) : selector;
            if (typeof this.sidebar === 'undefined') throw new Error('Incorrect sidebar value');
            sidebar = this.sidebar;

            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            this.options = extend(DEFAULTS, options);

            sidebarInner = this.sidebar.querySelector(this.options.sidebarInner);
            if (sidebarInner === null) throw new Error('Incorrect sidebar inner value');

            _initialize();

            window.scrollBy(0, -1);
            window.scrollBy(0, 1);
        }

        function _initialize() {
            window.addEventListener('scroll', _hundler);
            window.addEventListener('resize', _hundler);
            _hundler();
        }

        function _hundler() {
            if (getComputedStyle(sidebarInner).position === 'static') {
                return
            }
            topGap = parseInt(getComputedStyle(sidebar).top);
            bottomGap = parseInt(getComputedStyle(sidebar).bottom);

            pageScrollX = Math.floor(scrollX);
            pageScrollY = Math.floor(scrollY);
            sidebarTopCoord = getRect(sidebar).top;
            sidebarBottomCoord = sidebarTopCoord + getRect(sidebar).height;
            innerTopCoord = getRect(sidebarInner).top;
            innerBottomCoord = innerTopCoord + getRect(sidebarInner).height;

            if (pageScrollY <= sidebarTopCoord - topGap) {
                _changePosition('start');
            } else if (pageScrollY > sidebarTopCoord - topGap && innerBottomCoord < sidebarBottomCoord || pageScrollY < innerTopCoord - topGap) {
                _changePosition('middle');
            } else if (innerBottomCoord >= sidebarBottomCoord) {
                _changePosition('end');
            }
        }

        function _changePosition(position) {
            switch (position) {
                case 'start':
                    stylize(sidebarInner, {
                        position: 'relative',
                    });
                    break;
                case 'middle':
                    sidebarMode = (getRect(sidebarInner).height + topGap + bottomGap >= window.innerHeight) ?
                        'full' : '';
                    if (sidebarMode === 'full') {
                        var innerRelativeTopCoord = getRect(sidebarInner).top - getRect(sidebar).top;

                        stylize(sidebarInner, {
                            position: 'relative',
                            top: `${innerRelativeTopCoord}px`,
                        });

                        currScroll = scrollY;
                        if (currScroll > lastScroll) {
                            lastScroll = currScroll;
                            if (pageScrollY + window.innerHeight - bottomGap >= innerBottomCoord) {
                                stylize(sidebarInner, {
                                    position: 'fixed',
                                    width: `${getRect(sidebar).width}px`,
                                    bottom: `${bottomGap}px`,
                                    left: `${getRect(sidebar).left}px`,
                                });
                            }
                        } else {
                            if (pageScrollY <= innerTopCoord - topGap) {
                                stylize(sidebarInner, {
                                    position: 'fixed',
                                    width: `${getRect(sidebar).width}px`,
                                    top: `${topGap}px`,
                                    left: `${getRect(sidebar).left}px`,
                                });
                            }
                        }
                        lastScroll = currScroll;
                    } else {
                        stylize(sidebarInner, {
                            position: 'fixed',
                            width: `${getRect(sidebar).width}px`,
                            top: `${topGap}px`,
                            left: `${getRect(sidebar).left}px`,
                        });
                    }
                    break;
                case 'end':
                    stylize(sidebarInner, {
                        position: 'relative',
                        top: `${Math.floor(getRect(sidebar).height - getRect(sidebarInner).height)}px`,
                    });
                    break;
            }
        }

        return StickySidebar;
    }();

    return StickySidebar;
}();