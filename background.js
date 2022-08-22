chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    
    if(request.action=="set"){
        // localStorage.setItem("thrshield-user", request.username);
        // localStorage.setItem("userKey", request.uid);
        // localStorage.setItem("compKey", request.cid);
        // sessionStorage.setItem("asdf","vdx");
        
    }
    console.log("fUUUUUUUUUUUUUUUUUUUUUUUUUUUUU");
    
    sendResponse({u:"output: "});
});
