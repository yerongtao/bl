'use strict';

// load dependencies
var animationControl = require('./animation-control.js');
var data = {}
data.vtour = [{
        "swf": "vtour/nk.swf",
        "xml": "vtour/nk.xml",
        "target": "nk",
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
data.blImages = [
    './dist/images/bl/bl_0.png',
    './dist/images/bl/bl_1.png',
    './dist/images/bl/bl_2.png',
    './dist/images/bl/bl_3.png',
    './dist/images/bl/bl_4.png',
    './dist/images/bl/bl_5.png',
    './dist/images/bl/bl_6.png',
    './dist/images/bl/bl_7.png',
    './dist/images/bl/bl_8.png',
    './dist/images/bl/bl_9.png'
]

for (var i = 0; i < data.blImages.length; i++) {
    var imgPreload = new Image();
    imgPreload.src = data.blImages[i];
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
        $swiperSlide = $('.swiper-slide'),
        $loading = $('.loading-overlay'),
        $niaokan = $('.page-quanjing');

    var embedPano = function (index) {
        embedpano({
            swf: data.vtour[index].swf,
            xml: data.vtour[index].xml,
            target: data.vtour[index].target,
            html5: "auto",
            mobilescale: 1.0,
            passQueryParameters: true
        });
    }
    
    embedPano(0);

    $(".list-3,.list-4").css("marginBottom", listHeight);

    // init Swiper
    new Swiper('.swiper-container', {
        mousewheelControl: true,
        effect: 'slide', // slide, fade, coverflow or flip
        speed: 600,
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


    $swiperSlide.each(function (index) {
        $('.slide-bl-' + index).css("background-image", "url(../images/bl/bl_" + index + ".png)");
        // $('.slide-bl-' + index).css("background-size", "cover");
    })

    $loading.slideUp();

    // 下方导航 menu-main 的切换
    $menuLi.each(function (index) {
        $(this).click(function () {
            $menuLi.removeClass("action");
            $(this).addClass("action");
            if (index != 3 && index != 4) {
                $page.removeClass("action")
                    .eq(index).addClass("action");
                $(".list-3,.list-4").removeClass("action");
            } else if (index == 3 || index == 4) {
                $(".list-" + index).toggleClass("action");
                $(".list-" + (index == 3 ? 4 : 3)).removeClass("action");
            }
        });
    });
    // 户型导航的切换
    $hxListA.each(function (index) {
        $(this).click(function () {
            $(".page,.shinei-show").removeClass("action");
            $(".shinei-hx" + index).addClass("action");
            embedPano(index + 1);
            $.ajax({
                type: 'POST',
                url: 'https://heshuime.cn/dc/index.php/Api/Dapi/click_edit',
                data: {
                    type: index + 1
                },
                success: function () {
                    console.log("post 成功 ：type = " + (index + 1))
                },
                error: function () {
                    console.log("post 失败 ：type = " + (index + 1))
                }
            });
        })
    })
    // 背景音乐
    // $btnMusic.click(function () {
    //     if (bgMusic.paused) {
    //         bgMusic.play();
    //         $(this).removeClass('paused');
    //     } else {
    //         bgMusic.pause();
    //         $(this).addClass('paused');
    //     }
    // });


});