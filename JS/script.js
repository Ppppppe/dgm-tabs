var competitions = [];
var courses = new Set();
var tabel = document.getElementById('tab');

const callback = () => {
    saveLocalValues();
    const codeInput = document.querySelector('#code');
    let code = codeInput.value;
    let competitions;
    getCompetitionsJSONs(code);
    console.log(window.competitions);
    // console.log(courses.length);
};

async function getCompetitionsByCode (code) {
    let url = "https://discgolfmetrix.com/api.php?content=my_competitions&code=" + code;
    let response = await fetch(url);
    if (response.ok) {
        let json = await response.json();
        return json.my_competitions;
    } else {
        return "error";
    }
}

async function getCompetitionResult(compet_id, code) {
    let url = "https://discgolfmetrix.com/api.php?content=result&id="+ compet_id + "&code=" + code;
    let response = await fetch(url);
    if (response.ok) {
        let json = await response.json();
        return json;
    } else {
        return "error";
    }
}

function getCompetitionsJSONs(code) {
    getCompetitionsByCode(code).then((compets) => {
        
        compets.forEach(function(item, i, compets) {
            
            getCompetitionResult(item, code).then((res) => {
                if ((res.Competition.HasSubcompetitions != 0) || (res.Competition.Results.length == 0))
                    return;
                window.competitions.push(res);
                
                let courseId = res.Competition.CourseID;
                let courseTile = document.getElementById('course-' + courseId);
                if (courseTile == null) {
                    courseTile = document.createElement('div');
                    courseTile.classList.add('course-tile');
                    courseTile.id = 'course-' + courseId;
                    let courseName = res.Competition.CourseName.replaceAll("&rarr;", "→");
                    courseTile.textContent = courseName;
                    tabel.appendChild(courseTile);
                }

                let competitionId = item;
                let competitionTile = document.getElementById('competition-' + competitionId);
                if (competitionTile == null) {

                    competitionTile = document.createElement('div');
                    competitionTile.classList.add('competition-tile');
                    competitionTile.id = 'competition-' + competitionId;
                    let competitionName = res.Competition.Name.replaceAll("&rarr;", "→");
                    competitionTile.textContent = competitionName
                    courseTile.appendChild(competitionTile);
                }
            });
        });
        const c = window.competitions.length;
        console.log("length - " + c);
    })
}

function setLocalValues() {

    let inputFields = document.getElementsByTagName("input");
    for (const iterator of inputFields) {
        let storageValue = localStorage.getItem(iterator.id);
        iterator.value = storageValue;
    }
}

function saveLocalValues() {
    let inputFields = document.getElementsByTagName("input");

    for (const iterator of inputFields) {
        localStorage.setItem(iterator.id, iterator.value);
    }
}

setLocalValues();
const button = document.querySelector('#button1');
button.addEventListener('click', callback);