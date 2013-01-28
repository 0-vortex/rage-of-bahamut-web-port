// ==UserScript==
// @name         vortex Rage of Bahamut web port
// @namespace    http://vortex.re/
// @version      0.3
// @description  Rage of Bahamut ios/android app web port
// @match        http://bahamut-i.cygames.jp/bahamut_n/*
// @copyright    2013+, Teodor Eugen Dutulescu
// ==/UserScript==

var $ = unsafeWindow.jQuery;
var Rage = {
    time: new Date().getTime(),
    regexp: {},
    uri: window.location.pathname.replace(/^\/bahamut_n\//gi, ''),
    top: $('div#top'),
    junk: ['div.toppadding', // top spacing
           'div.bottompadding', // bottom spacing
		   'a[href="http://bahamut-i.cygames.jp/bahamut_n/gacha_box/index?hash=lg"]', // stupid spacers
           //'br', // * new lines
           'img[src="http://ava-a.mbga.jp/i/dot.gif"]'], // * transparent images
    
    init: function () {
        Rage.myPageCheck()
        	.removeJunk()
        	.fixFont()
        	.fixCss();
        
        console.log('Loaded script in ' + (new Date().getTime() - Rage.time) / 1000 + ' seconds');
    },
    
    fixCss: function () {
        $('a[href="http://bahamut-i.cygames.jp/bahamut_n/knights/knights_top_for_member"]', Rage.top).css('width', '90%');
        
        Rage.top.css({
            'background': '#111',
            'border': '2px solid #1a1a1a'
        }).parent().css('background', '#0a0a0a');
        
        $('br', Rage.top).each(function(){
            $(this).replaceWith(document.createElement('div'));
        });
        
        return Rage;
    },
    
    myPageCheck: function () {
    	if (Rage.uri == "mypage") {
            var timer = new Date().getTime();
            var timeout = 300000;
            
            Rage.junk.push('a[href="http://bahamut-i.cygames.jp/bahamut_n/official/top/cards_introduction_5forms?card=0"]', // * x5 legendary ad
                           'img[src="http://bahamut-i.cygames.jp/bahamut_n/image_sp/ui/ui_line_kishidan.png"]', // "The Order" text
                           'img[src="http://bahamut-i.cygames.jp/bahamut_n/image_sp/ui/ui_line_menu_01.jpg"]', // quest notification upper arrow
                           'img[src="http://bahamut-i.cygames.jp/bahamut_n/image_sp/ui/ui_line_menu_02.jpg"]', // quest notification bottom arrow
                           '> div:eq(4)', // * random card list
                           '> div:eq(5)', // * quest notification text
						   '> div:eq(7)', // * card box ad
                      	   '> div:eq(10)', // * invite friend ad 
                      	   '> div:eq(11)', // * twitter ad
                      	   '> div:eq(12)', // * tom ad
                      	   '> div:eq(28)', // * push settings
                      	   '> div:eq(29)'); // * copyright
            
            window.setTimeout(function(){window.location.reload();}, timeout); // home page keep-alive
            
            window.setInterval(function(){console.log(Math.round((timer + timeout - new Date().getTime()) / 1000) + ' seconds left to refresh');}, 10000);
        }
        
        return Rage;
	},
	
    removeJunk: function () {
        $(Rage.junk.join(','), Rage.top).remove();
        
        return Rage;
    },
    
    fixFont: function () {
        WebFontConfig = {
            google: { families: [ escape(fontName) + '::latin' ] }
        };
		var fontName = 'Roboto Condensed';
        var font = document.createElement('link');
            font.type = 'text/css';
            font.href = 'http://fonts.googleapis.com/css?family=' + escape(fontName);
            font.rel  = 'stylesheet';
        
        $('head').append(font);
        Rage.top.css('font-family', "'" + fontName + "', sans-serif");
        $('input').css('font-family', "'" + fontName + "', sans-serif !important");
        
        return Rage;
    }
};

$(document).ready(function(){
    Rage.init();
});
