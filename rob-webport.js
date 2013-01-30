// ==UserScript==
// @name         vortex Rage of Bahamut web port
// @namespace    http://vortex.re/
// @version      0.4.2
// @description  Rage of Bahamut ios/android app web port
// @match        http://bahamut-i.cygames.jp/bahamut_n/*
// @copyright    2013+, Teodor Eugen Dutulescu
// ==/UserScript==

var $ = unsafeWindow.jQuery;
var Rage = {
    time: new Date().getTime(),
    regexp: {
        stamina: /^STAMINA:\s([0-9]*)\/.*$/gi,
        bossFight: /action="(.*?_quest_boss\/appear\/(?:[1-9]|1[0-9]|2[0-1])\/6)"[^>]*>\s*<input\stype="submit"\svalue="Fight\sthe\sboss!"/gi,
        bossPlay: /"bp":"(.*?)"/gi
    },
    data: {
        questThreshHold: 80,
        stamina: 0
    },
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
        	.fixCss()
        	.getStamina()
        	.quest();
        
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
    },
    
    getStamina: function () {
        var status = $('#status', Rage.top);
        if (status.length > 0) {
            var staminaText = $('tr:eq(0) th:eq(1)', status);
            
            console.log('Main page detected, attempting to autoquest !');
            
            var stamina = Rage.regexp.stamina.exec(staminaText.text());

            if (stamina[1] !== 'undefined') {
                Rage.data.stamina = parseInt(stamina[1], 10);
                
                console.log('Current stamina: ' + Rage.data.stamina);
            }   
        }
        
        return Rage;
    },
    
    quest: function () {
        if (Rage.data.stamina >= Rage.data.questThreshHold) {
            console.log('Executing one jump-ahead');
            
            $.ajax({
                url: 'http://bahamut-i.cygames.jp/bahamut_n/app_manage/post_redirection/?url=events%2Fevent_010_quest%2Fdo_skip',
                type: 'post',
                success: function (data) {
                    var bossFight = Rage.regexp.bossFight.exec(data);
                    
                    if (bossFight[1] !== 'undefined') {
                        console.log('Iminent boss fight detected, attempting to kill boss:');

                        $.ajax({
                            url: 'http://bahamut-i.cygames.jp/bahamut_n/app_manage/post_redirection/?url=events%2Fevent_010_quest_boss%2Fboss_play_swf%2F21',
                            type: 'post',
                            data: {
                                accesskey_5: 'Fight Boss'
                            },
                            success: function (data) {
                                var bp = Rage.regexp.bossPlay.exec(data);
                                
                                console.log(bp);
                                
                                console.log('Boss fight successfully completed !');
                            }
                        });
                    }
                    
                    else {
        		console.log('Sylvan jump ahead executed successfully !');
                    }
                }
            });
        }
    }
};

$(document).ready(function(){
    Rage.init();
});
