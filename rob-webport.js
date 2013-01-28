// ==UserScript==
// @name         vortex Rage of Bahamut web port
// @namespace    http://vortex.re/
// @version      0.2
// @description  Rage of Bahamut ios/android app web port
// @match        http://bahamut-i.cygames.jp/bahamut_n/*
// @copyright    2013+, Teodor Eugen Dutulescu
// ==/UserScript==

var $ = unsafeWindow.jQuery;
var Rage = {
    time: new Date().getTime(),
    uri: window.location.pathname.replace(/^\/bahamut\//, ''),
    top: $('div#top'),
    junk: ['> div.toppadding', // top spacing
            '> div.bottompadding', // bottom spacing
    		'a[href="http://bahamut-i.cygames.jp/bahamut_n/gacha_box/index?hash=lg"]', // stupid spacers
            '> br', // * new lines
            '> a[href="http://bahamut-i.cygames.jp/bahamut_n/image_sp/ui/ui_line_footer.png"]', // bottom logo
            '> img[src="http://ava-a.mbga.jp/i/dot.gif"]'], // * transparent images
    init: function () {
        Rage.myPageCheck()
        	.removeJunk()
        	.fixFont();
        
        console.log('Loaded script in ' + (new Date().getTime() - Rage.time) / 1000 + ' seconds');
    },
    
    myPageCheck: function () {
    	if (Rage.uri == "mypage") {
            var timer = new Date().getTime();
            var timeout = 300000;
            
            Rage.junk.push('a[href="http://bahamut-i.cygames.jp/bahamut_n/official/top/cards_introduction_5forms?card=0"]', // * x5 legendary ad
						   '> div:eq(7)', // * card box ad
                      	   '> div:eq(10)', // * invite friend ad 
                      	   '> div:eq(11)', // * twitter ad
                      	   '> div:eq(12)'); // * tom ad
            
            window.setTimeout(function(){window.location.reload();}, timeout); // home page keep-alive
            
            window.setInterval(function(){console.log(Math.round((timer + timeout - new Date().getTime()) / 1000) + ' seconds left to refresh');}, 10000);
        }
        
        return Rage;
	},
	
    removeJunk: function () {
        $(Rage.junk.join(','), top).remove();
        
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
    }
};

$(document).ready(function(){
    Rage.init();
});
