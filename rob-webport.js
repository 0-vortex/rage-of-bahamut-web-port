// ==UserScript==
// @name         vortex Rage of Bahamut web port
// @namespace    http://vortex.re/
// @version      0.1
// @description  Rage of Bahamut ios/android app web port
// @match        http://bahamut-i.cygames.jp/bahamut_n/*
// @copyright    2013+, Teodor Eugen Dutulescu
// ==/UserScript==

if (window.location.pathname == "/bahamut_n/mypage") {
    var timer = new Date().getTime();
    var timeout = 300000;
    
    window.setTimeout(function(){window.location.reload();}, timeout);
    
    window.setInterval(function(){console.log(Math.round((timer + timeout - new Date().getTime()) / 1000) + ' seconds left to refresh');}, 10000);
}

var $ = unsafeWindow.jQuery;

// remove unnecessary objects and links
console.log($('#top>div:eq(12)').get(0));
var top = $('div#top');
var junk = ['a[href="http://bahamut-i.cygames.jp/bahamut_n/gacha_box/index?hash=lg"]', // stupid spacers
            'a[href="http://bahamut-i.cygames.jp/bahamut_n/official/top/cards_introduction_5forms?card=0"]', // * x5 legendary ad
            // '> br', // * new lines
            '> img[src="http://ava-a.mbga.jp/i/dot.gif"]', // * transparent images
            '> div:eq(7)', // * card box ad
            '> div:eq(10)',	// * invite friend ad 
            '> div:eq(11)',	// * twitter ad
            '> div:eq(12)']; // * tom ad
                     
$(junk.join(','), top).remove();
