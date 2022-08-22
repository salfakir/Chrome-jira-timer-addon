//the popup functionality, 
window.onload = function(){
    var user = document.getElementById("thrshield-user");
    var userKey = document.getElementById("userKey");
    var compKey= document.getElementById("compKey");

    load();

    async function load(){
        var creds = await new Promise(function (resolve, reject) {
            chrome.storage.local.get(['username','humanID', 'compID'], function (result) {
                resolve([result.username, result.humanID, result.compID]);
            });
        });
        user.value= creds[0];
        userKey.value= creds[1];
        compKey.value= creds[2];
        
        // chrome.storage.local.set({humanID: userKey.value, compID:compKey.value}, function() { } );
        // chrome.runtime.sendMessage({action: "set", username:localStorage.getItem("thrshield-user"), uid: localStorage.getItem("userKey"),
        //         cid: localStorage.getItem("compKey")},function(response) {
        //     alert("GOT RESPONSE!! User:" + response.u)});
    }
    document.getElementById("save").onclick= function (){save()};
    function save(){
        
        
        chrome.storage.local.set({username: user.value, humanID: userKey.value, compID:compKey.value}, function() { } );

        document.getElementById("note").innerText="Saved!";
        setTimeout(function (){document.getElementById("note").innerText="";}, 1000);
        
    }
    
}
// , username:localStorage.getItem("thrshield-user"), uid: localStorage.getItem("userKey"),
//          cid: localStorage.getItem("compKey")