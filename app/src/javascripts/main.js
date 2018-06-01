'use strict';

// load dependencies
var animationControl = require('./animation-control.js');
var data = [{
        "swf": "vtour/tour_B.swf",
        "xml": "vtour/tour_B.xml",
        "target": "tour_B",
    },
    {
        "swf": "vtour/NA.swf",
        "xml": "vtour/NA.xml",
        "target": "NA",
    },
    {
        "swf": "vtour/NB.swf",
        "xml": "vtour/NB.xml",
        "target": "NB",
    },
    {
        "swf": "vtour/A1.swf",
        "xml": "vtour/A1.xml",
        "target": "A1",
    },
    {
        "swf": "vtour/B1.swf",
        "xml": "vtour/B1.xml",
        "target": "B1",
    },
    {
        "swf": "vtour/C1.swf",
        "xml": "vtour/C1.xml",
        "target": "C1",
    }

]
var dataImg = [
    '../images/bl_bg_01.png',
    '../images/bl/bl_00.png',
    '../images/bl/bl_01.png',
    '../images/bl/bl_02.png',
    '../images/bl/bl_03.png',
    '../images/bl/bl_04.png'
]

for (var i = 0; i < dataImg.length; i++) {
    var imgPreload = new Image();
    imgPreload.src = dataImg[i];
}

$(document).ready(function () {
    var $body = $("body"),
        bgMusic = $('audio').get(0),
        $menuMain = $('.menu-main'),
        listHeight = $menuMain.innerHeight(),
        $menuLi = $(".munu-li"),
        $page = $(".page"),
        $hxListA = $(".hx-list-a"),
        $btnMusic = $('.btn-music'),
        $loading = $('.loading-overlay');

    var embedPano = function (index) {
        embedpano({
            swf: data[index].swf,
            xml: data[index].xml,
            target: data[index].target,
            html5: "auto",
            mobilescale: 1.0,
            passQueryParameters: true
        });
    }
    $(".list-2,.list-3").css("marginBottom", listHeight);

    // init Swiper
    new Swiper('.swiper-container', {
        mousewheelControl: true,
        effect: 'coverflow', // slide, fade, coverflow or flip
        speed: 400,
        direction: 'vertical',
        fade: {
            crossFade: false
        },
        coverflow: {
            rotate: 100,
            stretch: 0,
            depth: 300,
            modifier: 1,
            slideShadows: false // do disable shadows for better performance
        },
        flip: {
            limitRotation: true,
            slideShadows: false // do disable shadows for better performance
        },
        onInit: function (swiper) {
            animationControl.initAnimationItems(); // get items ready for animations
            animationControl.playAnimation(swiper); // play animations of the first slide
        },
        onTransitionStart: function (swiper) { // on the last slide, hide .btn-swipe
            if (swiper.activeIndex === swiper.slides.length - 1) {
                $('.up-arrow').hide();
            } else {
                $('.up-arrow').show();
            }
        },
        onTransitionEnd: function (swiper) { // play animations of the current slide
            animationControl.playAnimation(swiper);
        },
        onTouchStart: function (swiper, event) {
            // mobile devices don't allow audios to play automatically, it has to be triggered by a user event(click / touch).
            // if (!$btnMusic.hasClass('paused') && bgMusic.paused) {
            //     bgMusic.play();
            // }
        },
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
    });

    $loading.slideUp();

    // 下方导航 menu-main 的切换
    $menuLi.each(function (index) {
        $(this).click(function () {
            $menuLi.removeClass("action");
            $(this).addClass("action");
            if (index != 2 && index != 3) {
                $page.removeClass("action")
                    .eq(index).addClass("action");
                $(".list-2,.list-3").removeClass("action");
            } else if (index == 2 || index == 3) {
                $(".list-" + index).toggleClass("action");
                $(".list-" + (index == 2 ? 3 : 2)).removeClass("action");
            }
        });
    });
    // 户型导航的切换
    $hxListA.each(function (index) {
        $(this).click(function () {
            $(".page,.shinei-show").removeClass("action");
            $(".shinei-hx" + index).addClass("action");
            embedPano(index + 1);
        })
    })
    // 背景音乐
    $btnMusic.click(function () {
        if (bgMusic.paused) {
            bgMusic.play();
            $(this).removeClass('paused');
        } else {
            bgMusic.pause();
            $(this).addClass('paused');
        }
    });
    // 加载外部js文件
    $body.append("<script src='vtour/tour.js'></script>")

});