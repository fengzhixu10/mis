let throttle = function (func, wait) {
    let timeout = null,
        result = null,
        previous = 0;
    return function (...args) {
        let now = new Date,
            context = this;
        let remaining = wait - (now - previous);
        if (remaining <= 0) {
            clearTimeout(timeout);
            previous = now;
            timeout = null;
            result = func.apply(context, args);
        } else if (!timeout) {
            timeout = setTimeout(() => {
                previous = new Date;
                timeout = null;
                result = func.apply(context, args);
            }, remaining);
        }
        return result;
    }
}

function debounce(func, wait, immediate) {
    let result = null,
        timeout = null;
    return function anonymous(...args) {
        let context = this,
            now = immediate && !timeout;
        clearInterval(timeout);
        timeout = setTimeout(() => {
            timeout = null;
            !immediate ? result = func.call(context, ...args) : null;
        }, wait);
        now ? result = func.call(context, ...args) : null;
        return result;
    }
}

let bannerModule = (function () {
    let $container = $(".container"),
        $wrapper = $container.find(".wrapper"),
        $pagination = $container.find(".pagination"),
        $buttonPrev = $container.find(".button-prev"),
        $buttonNext = $container.find(".button-next"),
        $slideList = null,
        $paginationList = null;

    let autoTimer = null,
        interval = 3000,
        speed = 800,
        activeIndex = 0,
        count = 0;

    let queryData = function (callBack) {
        // data=>result
        $.ajax({
            url: "json/bannerData1.json",
            method: "get",
            success: (result) => {
                typeof callBack === "function" ? callBack(result) : null;
            },
        });
    };

    let bindHTML = function (data) {
        let str1 = ``,
            str2 = ``;
        data.forEach((item, index) => {
            str1 += `<div class="slide">
                <img src="${item.pic}" alt="">
            </div>`;

            str2 += `<span class="${index === 0 ? "active" : ""}"></span>`;
        });
        $wrapper.html(str1);
        $pagination.html(str2);
        $slideList = $wrapper.children(".slide");
        $paginationList = $pagination.children("span");
    };

    let change = function () {
        let $active = $slideList.eq(activeIndex),
            $siblings = $active.siblings();
        $active.css('transition', `opacity ${speed}ms`);
        $siblings.css('transition', `opacity 0ms`);

        $active.css('z-index', 1);
        $siblings.css('z-index', 0);
        $active.css('opacity', 1).on('transitionend', function () {
            $siblings.css('opacity', 0);
        });

        autoFocus();
    };
    let autoMove = function () {
        activeIndex++;
        activeIndex >= count ? activeIndex = 0 : null;
        change();
    };

    let autoFocus = function () {
        $paginationList.each((index, item) => {
            let $item = $(item);
            if (index === activeIndex) {
                $item.addClass('active');
                return;
            }
            $item.removeClass('active');
        });
    };

    let handlePagination = function () {
        $paginationList.mouseover(throttle(function () {
            activeIndex = $(this).index();
            change();
        }, 1000));
    };

    let handleButton = function () {
        $buttonNext.click(throttle(autoMove, 1000));
        $buttonPrev.click(throttle(function () {
            activeIndex--;
            activeIndex < 0 ? activeIndex = count - 1 : null;
            change();
        }, 1000));
    }

    return {
        init() {
            queryData(function anonymous(data) {
                bindHTML(data);
                count = data.length; //=>4
                autoTimer = setInterval(autoMove, interval);
                handlePagination();
                handleButton();
            });
            $container.mouseenter(function () {
                clearInterval(autoTimer);
            }).mouseleave(function () {
                autoTimer = setInterval(autoMove, interval);
            });
        }
    };
})();
bannerModule.init();


(function () {
    let timer1 = null,
        now = null,
        target = new Date('2020/12/27 14:00:00'),
        time = document.querySelector('.time'),
        shi = document.querySelector('.shi'),
        fen = document.querySelector('.fen'),
        miao = document.querySelector('.miao');

    function func(callBack) {
        let xhr = new XMLHttpRequest;
        xhr.open('head', 'json/bannerData1.json', true);
        xhr.onreadystatechange = function () {
            if (/^(2|3)\d{2}$/.test(xhr.status) && xhr.readyState === 2) {
                now = new Date(xhr.getResponseHeader('Date'));             
                callBack && callBack();
            }
        }
        xhr.send(null);
    };

    function computed() {
        let spanTime = target - now;

        if (spanTime <= 0) {
            clearInterval(timer1);
            timer = null;
            time.innerHTML = '开抢~~';
            return;
        }
        let hours = Math.floor(spanTime / 60 / 60 / 1000);
        spanTime -= hours * 60 * 60 * 1000;
        let minutes = Math.floor(spanTime / 60 / 1000);
        spanTime -= minutes * 60 * 1000;
        let seconds = Math.floor(spanTime / 1000);
        
        shi.innerHTML = `${hours<10?'0'+hours:hours}`;
        fen.innerHTML = `${minutes<10?'0'+minutes:minutes}`;
        miao.innerHTML = `${seconds<10?'0'+seconds:seconds}`;
        now = new Date(now.getTime() + 1000);
        console.log(hours,minutes,seconds);
        
    }

    func(function anonymous() {
        computed();
        timer1 = setInterval(computed, 1000);
    });
}());


// if (hours < 10) {
//     hours = '0' + hours;
// }
// if (minutes < 10) {
//     minutes = '0' + minutes;
// }
// if (seconds < 10) {
//     seconds = '0' + seconds;
// }

/* 家电 */
(function () {
    let $tabBox = $('.household .tabBox'),
        $spanList = $tabBox.find('span'),
        $householdSho = $('.household .householdSho'),

        $householdRight = $householdSho.find('.householdRight'),
        prevIndex = 0;


    $spanList.on('mouseenter', function () {
        let $this = $(this),
            index = $this.index();

        if (index === prevIndex) return;
        $spanList.eq(prevIndex).removeClass('active');
        $householdRight.eq(prevIndex).removeClass('active');

        $this.addClass('active');
        $householdRight.eq(index).addClass('active');

        prevIndex = index;

    });
}());

/* 智能 */
(function () {
    let $tabBox = $('.intelligence .tabBox'),
        $spanList = $tabBox.find('span'),
        $householdSho = $('.intelligence .householdSho'),

        $householdRight = $householdSho.find('.householdRight'),
        prevIndex = 0;


    $spanList.on('mouseenter', function () {
        let $this = $(this),
            index = $this.index();

        if (index === prevIndex) return;
        $spanList.eq(prevIndex).removeClass('active');
        $householdRight.eq(prevIndex).removeClass('active');

        $this.addClass('active');
        $householdRight.eq(index).addClass('active');

        prevIndex = index;

    });
}());

/* 搭配 */
    (function () {
        let $tabBox = $('.collocation .tabBox'),
            $spanList = $tabBox.find('span'),
            $householdSho = $('.collocation .householdSho'),

            $householdRight = $householdSho.find('.householdRight'),
            prevIndex = 0;


        $spanList.on('mouseenter', function () {
            let $this = $(this),
                index = $this.index();

            if (index === prevIndex) return;
            $spanList.eq(prevIndex).removeClass('active');
            $householdRight.eq(prevIndex).removeClass('active');

            $this.addClass('active');
            $householdRight.eq(index).addClass('active');

            prevIndex = index;

        });
}());
    
/* 配件 */
(function () {
    let $tabBox = $('.parts .tabBox'),
        $spanList = $tabBox.find('span'),
        $householdSho = $('.parts .householdSho'),

        $householdRight = $householdSho.find('.householdRight'),
        prevIndex = 0;


    $spanList.on('mouseenter', function () {
        let $this = $(this),
            index = $this.index();

        if (index === prevIndex) return;
        $spanList.eq(prevIndex).removeClass('active');
        $householdRight.eq(prevIndex).removeClass('active');

        $this.addClass('active');
        $householdRight.eq(index).addClass('active');

        prevIndex = index;
    });
}());

/* 周边 */
(function () {
    let $tabBox = $('.periphery .tabBox'),
        $spanList = $tabBox.find('span'),
        $householdSho = $('.periphery .householdSho'),

        $householdRight = $householdSho.find('.householdRight'),
        prevIndex = 0;


    $spanList.on('mouseenter', function () {
        let $this = $(this),
            index = $this.index();

        if (index === prevIndex) return;
        $spanList.eq(prevIndex).removeClass('active');
        $householdRight.eq(prevIndex).removeClass('active');

        $this.addClass('active');
        $householdRight.eq(index).addClass('active');

        prevIndex = index;
    });
}());