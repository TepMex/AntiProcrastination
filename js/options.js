var ruleHTMLString = '<tr class="rule"><td>Rule %rule_id%</td><td>%domain%</td><td>%action%</td><td>%since%</td><td>%until%</td><td>%maxtime%</td><td><button class="removeRule" id="del%rule_id%">Delete</button></td></tr>';
var rulesArray = [];

function init()
{
    $("#tbd")[0].innerHTML = "";
    $("#addButton").click(onClickAdd);
    function parseRules(rules)
    {
        rulesArray = JSON.parse(rules["AP_Rules"]);
        for(i=0;i<rulesArray.length;i++)
        {
            var rule = rulesArray[i];
            addRuleToTable(rule);
            
        }
        $(".removeRule").click(onClickDel);
    }
    chrome.storage.sync.get("AP_Rules",parseRules);
}

function addRuleToTable(rule)
{
    var htmlString = ruleHTMLString;
    htmlString = htmlString.replace(/%rule_id%/g,i);
    htmlString = htmlString.replace("%domain%",rule.domain);
    htmlString = htmlString.replace("%action%",rule.action.toUpperCase());
    htmlString = htmlString.replace("%since%",rule.since);
    htmlString = htmlString.replace("%until%",rule.until);
    htmlString = htmlString.replace("%maxtime%",rule.maxtime);
    $("#tbd")[0].innerHTML += htmlString;
}

function saveRules()
{
    var rules = rulesArray;
    var rulesToSave = JSON.stringify(rules);
    chrome.storage.sync.set({AP_Rules:rulesToSave},function(){console.log("[AP]Rules saved"); init();});
}

function onClickAdd(e)
{
    e.preventDefault();
    $("#addButton").off();
    var domain = $("#domain").val();
    var action = $("#action").val();
    var sinceHours = $("#sinceHours").val();
    var sinceMinutes = $("#sinceMinutes").val();
    var untilHours = $("#untilHours").val();
    var untilMinutes = $("#untilMinutes").val();
    var maxtime = parseInt($("#maxtime").val());
    
    if(!domain)
    {
        return;
    }
    
    var rule = {
        domain:domain,
        action:action,
        since:sinceHours+":"+sinceMinutes,
        until:untilHours+":"+untilMinutes,
        maxtime:maxtime
    };
    
    rulesArray.push(rule);
    saveRules();
    
}
function onClickDel(e)
{
    e.preventDefault();
    id = parseInt(e.target.id.replace("del",""));
    rulesArray.splice(id,1);
    saveRules();
}

$(document).ready(init);