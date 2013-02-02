// ==UserScript==
// @name         vortex Rage of Bahamut web port
// @namespace    http://vortex.re/
// @version      0.4.6
// @description  Rage of Bahamut ios/android app web port
// @match        http://bahamut-i.cygames.jp/bahamut_n/*
// @copyright    2013+, Teodor Eugen Dutulescu
// ==/UserScript==

// mobage functions
var _r = function (n) {
    return Math.floor(Math.random() * n);
}
var _e = function (c) {
    return c.charCodeAt(0) - 32;
}
var _d = function (i) {
    return String.fromCharCode(i + 32);
}
var _uf = function (a) {
    var r1 = [];
    var r2 = [];
    var l = a.length;
    for (var i = 0; i < l; i++) {
        if (i % 2 == 0) {
            r2.unshift(a[i]);
        }
        else {
            r1.push(a[i]);
        }
    }
    return r1.concat(r2);
}
var dc = function (t) {
    var n = 95, e, r, i, s = [], m = t.split('');
    var p = _e(m.pop());
    for (i = 0; i < p; i++) {
        m = _uf(m);
    }
    while (m.length != 0) {
        e = m.shift();
        r = m.pop();
        s.push(_d((_e(e) + n - _e(r)) % n));
    }
    return decodeURIComponent(s.join(''));
}

var $ = unsafeWindow.jQuery;

var Rage = {
    time: new Date().getTime(),
    regexp: {
        stamina: /^STAMINA:\s([0-9]*)\/.*$/gi,
        bossFight: /action="(.*?_quest_boss\/appear\/(?:[1-9]|1[0-9]|2[0-1])\/6)"[^>]*>\s*<input\stype="submit"\svalue="Fight\sthe\sboss!"/gi,
        bossPlay: /"bp":"(.*?)"/gi
    },
    data: {
        questThreshHold: 100,
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
        
        Rage.log('Loaded script in ' + (new Date().getTime() - Rage.time) / 1000 + ' seconds');
    },
    
    log: function (message) {
        console.log(message);
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
        Rage.log('Current uri: "' + Rage.uri + '"');
        
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
            
            window.setInterval(function(){Rage.log(Math.round((timer + timeout - new Date().getTime()) / 1000) + ' seconds left to refresh');}, 10000);
        }
        
        return Rage;
	},
	
    removeJunk: function () {
        $(document).ready(function(){
            console.log($(Rage.junk.join(','), Rage.top));
            
        	$(Rage.junk.join(','), Rage.top).remove();
        });
        
        return Rage;
    },
    
    fixFont: function () {
		var fontName = 'Roboto Condensed';
        var rules = document.createTextNode('body *, input[type="submit"], .page_container .lBtn { font-family: "' + fontName + '", "Arial", sans-serif !important; }');
        var style = document.createElement('style');
        	style.styleSheet ? style.styleSheet.cssText = rules.nodeValue : style.appendChild(rules);
        var link = document.createElement('link');
        	link.media = 'all';
            link.type = 'text/css';
            link.href = '//fonts.googleapis.com/css?family=' + escape(fontName);
            link.rel  = 'stylesheet';
        
        $('head').append([link, style]);
        
        return Rage;
    },
    
    getStamina: function () {
        var status = $('#status', Rage.top);
        
        if (Rage.uri == "mypage" && status.length > 0) {
            var staminaText = $('tr:eq(0) th:eq(1)', status);
            
            Rage.log('Main page detected, attempting to autoquest !');
            
            var stamina = Rage.regexp.stamina.exec(staminaText.text());

            if (stamina[1] !== 'undefined') {
                Rage.data.stamina = parseInt(stamina[1], 10);
                
                Rage.log('Current stamina: ' + Rage.data.stamina);
            }   
        }
        
        return Rage;
    },
    
    quest: function () {
        if (Rage.data.stamina >= Rage.data.questThreshHold) {
            Rage.log('Executing one jump-ahead');
            
            $.ajax({
                url: 'http://bahamut-i.cygames.jp/bahamut_n/app_manage/post_redirection/?url=events%2Fevent_010_quest%2Fdo_skip',
                type: 'post',
                success: function (data) {
                    var bossFight = Rage.regexp.bossFight.exec(data);
                    
                    Rage.log(typeof(bossFight));
                    
                    if (bossFight[1] !== 'undefined') {
                        Rage.log('Iminent boss fight detected, attempting to kill boss:');

                        $.ajax({
                            url: 'http://bahamut-i.cygames.jp/bahamut_n/app_manage/post_redirection/?url=events%2Fevent_010_quest_boss%2Fboss_play_swf%2F21',
                            type: 'post',
                            data: {
                                accesskey_5: 'Fight Boss'
                            },
                            success: function (data) {
                                var bp = Rage.regexp.bossPlay.exec(data);
                                
                                eval(dc(decodeURIComponent(bp[1])));
                                
                                $.ajax({
                                    url: nextPath + '/' + token,
                                    type: 'get',
                                    success: function (data) {
                                    	Rage.log(data);
                                	}
                                });
                                
                                Rage.log('Boss fight successfully completed !');
                            }
                        });
                    }
                    
                    else {
                		Rage.log('Sylvan jump ahead executed successfully !');
                    }
                }
            });
        }
	}
};

$(document).ready(function(){
    Rage.init();
});
