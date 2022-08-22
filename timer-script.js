// this file is the main handler of the timer.

//intiates the symbols and marks used in the app.
var settingsmark = "🛠";
var playmark = "▶";
var pausemark = "||";
var hidemark = "▼";
var showmark = "▲";

//get the page title, which contains the agile number, to uniquely store the timer information of the agile
var agile = document.title.match(/\[(.*?)\]/)[0];

//creates an extra div that will contain the timer
const container = document.createElement("div");
container.setAttribute("id", "Timming-timer");
//internal contents of the timer div
container.innerHTML = '<div id="Timming-timer">' +
    ' <div id="timer-contents" >' +
    ' <div id="timer-presenter">' +
    ' <p id="agile"></p>' +
    ' <table>' +
    ' <tr>' +
    ' <td><button id="actionButton" class="timer-btn">' + playmark + '</button></td>' +
    ' <td>' +
    ' <input class="timers" id="days" disabled="disabled"><input class="timers" id="hours" disabled="disabled"><input class="timers" id="minutes" disabled="disabled"><input class="timers" id="seconds" disabled="disabled">' +
    ' </td>' +
    ' <td><button id="editButton" class="timer-btn">' + settingsmark + '</button></td>' +
    ' </tr>' +
    ' </table>' +
    ' </br>' +
    ' <button id="completeButton" class="timer-btn">Submit</button>' +
    ' </br>' +
    ' </br>' +
    ' </div>' +
    ' <button id="timer-collapse" class="timer-visible">' + hidemark + '</button>' +
    ' ' +
    ' </div>' +
    ' </div>';

//adds the timer div to the website.
document.getElementById("jira-frontend").appendChild(container);
//starts the timer and collapses the div when the page loads
act();
collapse();

//sets the header of the div
document.getElementById("agile").innerText = agile;
//assigns the act function for the play/pause button
document.getElementById("actionButton").onclick = function () { act() };
//play/pause function 
//currently uses the marks on the button to identify if it should play/pause
function act() {
    if (localStorage.getItem(agile + "-start") == null) {
        var start = new Date().getTime();
        localStorage.setItem(agile + "-start", start);


        var intervalId = window.setInterval(function () { timer(); }, 1000);

        localStorage.setItem(agile + "-play", intervalId);
        document.getElementById("actionButton").innerText = pausemark;
        return
    }
    else if (document.getElementById("actionButton").innerText == playmark) {
        var intervalId = window.setInterval(function () { timer(); }, 1000);

        localStorage.setItem(agile + "-play", intervalId);
        document.getElementById("actionButton").innerText = pausemark;
        return
    }
    else if (document.getElementById("actionButton").innerText == pausemark) {
        pause();
    }
}
//function used to calculate time
function getDiff() {
    var now = new Date().getTime();
    var start = localStorage.getItem(agile + "-start");
    var accumelatedTime = localStorage.getItem(agile + "-accTime");

    var distance = now - parsing(start) + parsing(accumelatedTime);
    return distance;
}
//calculates the current time
function timer() {

    var distance = getDiff();

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").value = days;
    document.getElementById("hours").value = hours;
    document.getElementById("minutes").value = minutes;
    document.getElementById("seconds").value = seconds;
    return
}
//pause function that is used in multiple other functions
function pause() {
    
    clearInterval(localStorage.getItem(agile + "-play"));
    if (document.getElementById("actionButton").innerText == playmark) {
        return null;
    }

    var accumelatedTime = getDiff();
    localStorage.setItem(agile + "-accTime", accumelatedTime);
    localStorage.removeItem(agile + "-start");
    document.getElementById("actionButton").innerText = playmark;
}
//submit button functionality
document.getElementById("completeButton").onclick = function () { complete() };
async function complete() {
    pause();
    var creds = await new Promise(function (resolve, reject) {
        chrome.storage.local.get(['humanID', 'compID'], function (result) {
            resolve([result.humanID, result.compID]);
        });
    });

    companyID = creds[1];
    humanID = creds[0];
    web = window.location.href;
    if (confirm("Are you sure you want to submit?\n" +
        "company ID : " + companyID +
        "\nUser ID : " + humanID +
        "\nWebpage : " + web + "\n\nTime : " +
        document.getElementById("days").value + ":" +
        document.getElementById("hours").value + ":" +
        document.getElementById("minutes").value + ":" +
        document.getElementById("seconds").value
    ) == true) {
        time = Math.floor(localStorage.getItem(agile + "-accTime")/1000);
        var ex = await export_time(companyID, humanID, time, agile, web);
        if(ex){
            localStorage.removeItem(agile + "-play");
        localStorage.removeItem(agile + "-accTime");

        document.getElementById("days").value = 0;
        document.getElementById("hours").value = 0;
        document.getElementById("minutes").value = 0;
        document.getElementById("seconds").value = 0;
        }
        else{alert('something went wrong');}
    }
}
//edit functionality
document.getElementById("editButton").onclick = function () { edit() };
function edit() {
    if (document.getElementById("editButton").innerText == settingsmark) {
        pause();

        document.getElementById("days").disabled = false;
        document.getElementById("hours").disabled = false;
        document.getElementById("minutes").disabled = false;
        document.getElementById("seconds").disabled = false;

        document.getElementById("editButton").innerText = "✔";
    }
    else {
        if (confirm("Are you sure you want to submit this change?\n" +
            document.getElementById("days").value + ":" +
            document.getElementById("hours").value + ":" +
            document.getElementById("minutes").value + ":" +
            document.getElementById("seconds").value
        ) == true) {
            document.getElementById("days").value = parsing(document.getElementById("days").value);
            document.getElementById("hours").value = parsing(document.getElementById("hours").value);
            document.getElementById("minutes").value = parsing(document.getElementById("minutes").value);
            document.getElementById("seconds").value = parsing(document.getElementById("seconds").value);

            var newTime =
                document.getElementById("days").value * (1000 * 60 * 60 * 24)
                + document.getElementById("hours").value * (1000 * 60 * 60)
                + document.getElementById("minutes").value * (1000 * 60)
                + document.getElementById("seconds").value * (1000);

            localStorage.setItem(agile + "-accTime", newTime);
        }

        document.getElementById("days").disabled = true;
        document.getElementById("hours").disabled = true;
        document.getElementById("minutes").disabled = true;
        document.getElementById("seconds").disabled = true;

        document.getElementById("editButton").innerText = settingsmark;
    }

}
//used to convert input into integers
function parsing(str) {
    if (typeof str !== 'string') {
        return 0;
    }

    const num = Number(str);

    if (Number.isInteger(num)) {
        return num;
    }
    return 0;
}
//the collapse functionality
document.getElementById("timer-collapse").onclick = function () { collapse() };
function collapse() {
    if (document.getElementById("timer-collapse").innerText == hidemark) {

        document.getElementById("timer-collapse").classList.remove("timer-visible");
        document.getElementById("timer-collapse").classList.add("timer-clps");

        document.getElementById("timer-presenter").style.display = "none";
        document.getElementById("Timming-timer").classList.toggle("timer-hidden");
        document.getElementById("timer-collapse").innerText = showmark;
    }
    else {
        document.getElementById("timer-presenter").style.display = "block";

        document.getElementById("timer-collapse").classList.remove("timer-clps");
        document.getElementById("timer-collapse").classList.add("timer-visible");

        document.getElementById("Timming-timer").classList.toggle("timer-hidden");
        document.getElementById("timer-collapse").innerText = hidemark;
    }

}


//exports data to a php server
function export_time(companyID, humanID, time, agile, web) {
    return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://localhost:3000/extension/lw-chrome-extension/db.php', true);

    xhr.onload = function () {
        if (xhr.responseText == '1') { resolve (true) ;}
        else { reject(false); }
    };

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send('companyID=' + companyID +
        '&humanID=' + humanID +
        '&web=' + web +
        '&agile=' + agile +
        '&timer=' + time);
    });

}