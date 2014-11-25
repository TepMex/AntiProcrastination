//constants
var DISABLE = "disable";
var ENABLE = "enable";

//global
var maxTime = 0;
var currentTime = 0;

/*
* Rules manipulations(load,save,etc).
* Rule is JS-Object - {domain:"domain.com",action:DISABLE/ENABLE,since:"0:00",until:"01:00",maxtime:100}.


var testRules = [
    {domain:"livejournal.com",action:DISABLE,since:"1:00",until:"2:00",maxtime:6},
    {domain:"yandex.ru",action:ENABLE,since:"1:00",until:"3:00",maxtime:2}
];*/

function saveRules()
{
    var rules = testRules;
    var rulesToSave = JSON.stringify(rules);
    chrome.storage.sync.set({AP_Rules:rulesToSave},function(){console.log("[AP]Rules saved");});
}

function loadRules()
{
    function parseRules(rules)
    {
        var rulesArray = JSON.parse(rules["AP_Rules"]);
        for(i=0;i<rulesArray.length;i++)
        {
            rule = rulesArray[i];
            if(window.location.origin.search(rule.domain) >= 0)
            {
                obeyTheRule(rule);
                return;
            }
        }
    }
    chrome.storage.sync.get("AP_Rules",parseRules);
}

function obeyTheRule(rule)
{
    var currentDate = new Date();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    
    var sinceTime = rule.since.split(":");
    var since = {hours:parseInt(sinceTime[0]),minutes:parseInt(sinceTime[1])};
    var untilTime = rule.until.split(":");
    var until = {hours:parseInt(untilTime[0]),minutes:parseInt(untilTime[1])};
    
    var beforeInterval = since.hours>hours||(since.hours == hours&&since.minutes>minutes);
    var afterInterval = until.hours<hours||(until.hours == hours&&until.minutes<minutes);
    var inInterval = !beforeInterval&&!afterInterval;
    
    
    switch(rule.action)
    {
        case ENABLE:
            if(inInterval)
            { 
                enablePage(rule.maxtime);                
                if(rule.domain == "sputnikipogrom.com")
                {
                    $(".tp-overlay").detach();
                }
            } 
            else 
            {
                if(rule.domain == "twitter.com")
                {
                    $("#page-container").detach();
                }
                else
                {
                    disablePage();
                }
            }
            break;
        case DISABLE:
            if(inInterval)
            {
                if(rule.domain == "twitter.com")
                {
                    $("#page-container").detach();
                }
                else
                {
                    disablePage();
                }
            }
            else 
            {
                enablePage(rule.maxtime);
            }
            break;
    }
    
    
}

function enablePage(maxtime)
{
    if(maxtime != undefined)
    {
        if(maxtime>0)
        {
            maxTime = maxtime;
            setInterval(onInterval,60*1000);
        }
    }
    console.log("[AP]This page is now enabled. Maxtime:"+maxTime);
}

function onInterval()
{
    currentTime++;
    var delta = maxTime - currentTime;
    if(delta==3)
    {
        alert(chrome.i18n.getMessage("ThreeMinutesLeftAlert"));
    }
    else if(delta == 0)
    {
        disablePage();
    }
    console.log("[AP]tick");
}

function disablePage()
{
    chrome.extension.sendRequest({cmd: "getDisabledTemplate"}, function(html){
        $("html").html(html);
        document.title = chrome.i18n.getMessage("pageDisabledTitle")
        $("#disabled").text(chrome.i18n.getMessage("pageDisabled"));
        $("#disabledSecond").text(chrome.i18n.getMessage("pageDisabledSecond"));
    });
    console.log("[AP]This page is now disabled.");
}

function init()
{
    //saveRules();
    loadRules();
}

//$(document).ready(init);
init();
//console.log(chrome.i18n.getMessage("APDescription"));