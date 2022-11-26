
const token = "002e31af19b44d239e5f13e7e8a30661";
const baseURL = "https://api.football-data.org/v4//competitions/2000";
function getGroups() {
   const url = baseURL + "/standings";
   axios.get(url, {
       headers:{
           "X-Auth-Token": token
       }
   }).then((response)=>{
        //    console.log(response.data);
        //standing is an array of objects
        const groups = response.data.standings;

        for(group of groups){
            let groupName = group["group"];
            let groupCol = `
            <div class="col-12 col-sm-6 p-2 my-1">
                <div class="card shadow border-0">
                <div class="card-header text-center bg-primary text-white">
                    ${groupName}
                </div>
                <div class="card-body p-0">
                    <table class="table text-center">
                        <thead class="text-white" style="background-color: #6a0320;">
                        <tr class="p-0">
                        <th scope="col">Team</th>
                        <th scope="col">W</th>
                        <th scope="col">L</th>
                        <th scope="col">D</th>
                        <th scope="col">Pts</th>
                        </tr>
                        </thead>
                        <tbody>
            `;
            for(row of group["table"]){
                groupCol += `
                <tr>
                    <th scope="row">
                        <img src="${row["team"]["crest"]}" class="rounded-circle " style="width:45px; height:45px; object-fit: cover" alt="country flag">
                        ${row["team"]["tla"]}
                    </th>
                    <td>${row["won"]}</td>
                    <td>${row["lost"]}</td>
                    <td>${row["draw"]}</td>
                    <td>${row["points"]}</td>
                </tr>
                `;
            }

            groupCol += `
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            `;
            document.getElementById("groups").innerHTML += groupCol;
        }
    });
      
}

function getMatches() {
    const url = baseURL + "/matches";
    axios.get(url,{
        headers: {
            "X-Auth-Token": token
        }
    })
    .then((response) => {
        const matches = response.data.matches;
        console.log(response.data);
        for(match of matches){
            
            if(match["homeTeam"]["id"] == null || match["awayTeam"]["id"] == null || match["matchday"] == null){
                continue;
            }

            let homeScore = "";
            let awayScore = "";
            if(match.score.winner == "HOME_TEAM"){
                homeScore = "text-success";
                awayScore = "text-danger";
            }else if(match.score.winner == "AWAY_TEAM"){
                awayScore = "text-success";
                homeScore = "text-danger";
            }
            const utcDate = match["utcDate"];
            const matchDate = new Date(utcDate);
            const stringDate = matchDate.getFullYear() + "-" + (matchDate.getUTCMonth()+1) + "-" + matchDate.getUTCDate() + "  " + matchDate.getUTCHours() + ":" + matchDate.getUTCMinutes();
            let matchCol = `
            <div class="col-12 my-2">
                <div class="row rounded-pill overflow-hidden shadow">

                    <div class="col-3 bg-primary d-flex flex-column align-items-center justify-content-center p-3">
                        <img src="${match["homeTeam"]["crest"]}" class="rounded-circle" style="border:solid 2px white; object-fit: cover" width="40px" height="40px" alt="" >
                        <span class="text-white d-block">${match["homeTeam"]["tla"]}</span>
                    </div>
                    
                    <div class="col-6 d-flex flex-row align-items-center justify-content-around p-3">
                        <h3 class="${homeScore}">${match["score"]["fullTime"]["home"] ?? "-"}</h3>
                        <div class="d-flex flex-column align-items-center justify-content-center">
                            <span>${match["group"]}</span>
                            <span class="fs-2">X</span>
                            <span>${stringDate}</span>
                        </div>
                        <h3 class="${awayScore}">${match["score"]["fullTime"]["away"] ?? "-"}</h3>
                    </div>

                    <div class="col-3 bg-primary d-flex flex-column align-items-center justify-content-center p-3">
                        <img src="${match["awayTeam"]["crest"]}" class="rounded-circle" style="border:solid 2px white; object-fit: cover" width="40px" height="40px" alt="" >
                        <span class="text-white d-block">${match["awayTeam"]["tla"]}</span>
                    </div>
                </div>
            </div>

            `;
            document.getElementById("matches").innerHTML += matchCol;
        }
    });
}
getGroups();
getMatches();