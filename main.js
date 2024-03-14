
const firebaseConfig = {
    apiKey: "AIzaSyDLzmZyt5nZwCk98iZ6wi01y7Jxio1ppZQ",
    authDomain: "fine-bondedwarehouse.firebaseapp.com",
    databaseURL: "https://fine-bondedwarehouse-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fine-bondedwarehouse",
    storageBucket: "fine-bondedwarehouse.appspot.com",
    messagingSenderId: "415417723331",
    appId: "1:415417723331:web:15212f190062886281b576",
    measurementId: "G-SWBR4359JQ"
};
firebase.initializeApp(firebaseConfig);
const database_f = firebase.database();
const deptName = "WareHouseDept2";
const consigneeName="위아더월드";
let clickValue=[];
let outCountP={};
let outCountC={};
let ={};
function transDate(date){
    try{
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if(month < 10){
            month = "0" + month;
        };
        if(day < 10){
            day = "0" + day;
        };
        return date.getFullYear() + "-" + month + "-" + day;
    }catch(e){
        return "미정"
    }};
initDataTableTbody();
function initDataTableTbody(){
    const tbody=document.getElementById("dataTableTbody");
    tbody.replaceChildren();
    let tdValue={};
    database_f.ref("DeptName/"+deptName+"/InCargo/").get().then((snapshot)=>{
        //snapshot 하위노드의 값 가져오기
        const val=snapshot.val();
        for(let i in val){
           const val1=val[i];
           for(let j in val1){
              for(let k in val1[j]){
                const data=val1[j][k];
                if(data["consignee"]==consigneeName){
                    let key=data["date"]+"_"+data["bl"]+"_"+data["description"];
                    if(tdValue[key]==undefined){tdValue[key]={date:data["date"],bl:data["bl"],description:data["description"],incargo:parseInt(data["incargo"]),Pqty:parseInt(data["Pqty"]),remark:data["remark"]};}else{
                        tdValue[key]={date:data["date"],bl:data["bl"],description:data["description"],incargo:parseInt(data["incargo"])+parseInt(tdValue[key]["incargo"]),Pqty:parseInt(data["Pqty"])+parseInt(tdValue[key]["Pqty"]),remark:data["remark"]};
                    }
                };
           }
        }}
        for(let i in tdValue){
            const tr=document.createElement("tr");
            tr.setAttribute("id",tdValue[i]["bl"]+"_"+tdValue[i]["description"]);
            tr.addEventListener("click",function(e){
                const clickIndex=(e.target.parentNode.rowIndex-2);
                tr.classList.toggle("selected");    
                const trList = document.querySelectorAll("#dataTableTbody tr");
                clickValue=[trList[clickIndex].children[0].innerText,trList[clickIndex].children[1].innerText,trList[clickIndex].children[2].innerText,trList[clickIndex].children[5].innerText];
                for(let i in clickValue){
                    document.getElementById("trReg").children[i].children[1].value=clickValue[i];
                }}
            );            
            for(let j in tdValue[i]){
                const td=document.createElement("td");
                td.innerHTML=tdValue[i][j];
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    });
    
    
}
initLogTableTbody("2024-02-01",transDate(new Date()).substring(5,7),consigneeName);  
function initLogTableTbody(sDate,eDate){
    const sYear = sDate.substring(0,4);
    const eYear = eDate.substring(0,4);
    const sMonth = sDate.substring(5,7);
    const eMonth = eDate.substring(5,7);
    const tbodyP=document.getElementById("outPreTableTbody");
    const tbodyC=document.getElementById("outCompleteTableTbody");
    const key_f=["date","managementNo","description","outwarehouse","eaQty","pltQty","workprocess"];
    database_f.ref("DeptName/"+deptName+"/OutCargo/"+sMonth+"월").get().then((snapshot)=>{
        if(snapshot.exists()){
            let data = snapshot.val();
            let keys = Object.keys(data);
            for(let i=0;i<keys.length;i++){
                let key = keys[i];
                let cargo = data[key];
                if(Object.keys(cargo)!= "json 등록시 덥어쓰기 바랍니다"){
                    for(let j in cargo){
                        if(cargo[j]["consigneeName"]==consigneeName){
                            if(cargo[j]["managementNo"].includes(",")){
                                const no=cargo[j]["managementNo"].split(",");
                                const desc=cargo[j]["description"].split(",");
                                const ea=cargo[j]["eaQty"].split(",");
                                const pl=cargo[j]["pltQty"].split(",");
                                for(let i=0;i<no.length;i++){
                                    const tr=document.createElement("tr");
                                    const tdD=document.createElement("td");
                                    tdD.innerHTML=cargo[j]["date"];
                                    tr.appendChild(tdD);
                                    const tdN=document.createElement("td");
                                    tdN.innerHTML=no[i];
                                    tr.appendChild(tdN);
                                    const tdDe=document.createElement("td");
                                    tdDe.innerHTML=desc[i];
                                    tr.appendChild(tdDe);
                                    const tdE=document.createElement("td");
                                    const tdO=document.createElement("td");
                                    tdO.innerHTML=cargo[j]["outwarehouse"];
                                    tr.appendChild(tdO);
                                    tdE.innerHTML=ea[i];
                                    tr.appendChild(tdE);
                                    const tdP=document.createElement("td");
                                    tdP.innerHTML=pl[i];
                                    tr.appendChild(tdP);
                                    const tdW=document.createElement("td");
                                    tdW.innerHTML=cargo[j]["workprocess"];
                                    tr.appendChild(tdW);
                                    tbodyP.appendChild(tr);
                                    const keyValue=tr.cells[0].innerHTML+"_"+tr.cells[1].innerHTML+"_"+tr.cells[2].innerHTML;
                                        if(cargo[j]["workprocess"]=="미"){
                                        tbodyP.appendChild(tr);
                                        if(outCountP[keyValue]==undefined){
                                            outCountP[keyValue]={eaQty:tr.cells[4].innerHTML,pltQty:tr.cells[5].innerHTML,count:1};
                                        }else{
                                            outCountP[keyValue]={eaQty:parseInt(outCountP[keyValue]["eaQty"])+parseInt(tr.cells[4].innerHTML),pltQty:parseInt(outCountP[keyValue]["pltQty"])+parseInt(tr.cells[5].innerHTML),count:parseInt(outCountP[keyValue]["count"])+1};
                                        }
                                        }else if(cargo[j]["workprocess"]=="완"){
                                        tbodyC.appendChild(tr);
                                        if(outCountC[keyValue]==undefined){
                                            outCountC[keyValue]={eaQty:tr.cells[4].innerHTML,pltQty:tr.cells[5].innerHTML,count:1};
                                        }else{
                                            outCountC[keyValue]={eaQty:parseInt(outCountC[keyValue]["eaQty"])+parseInt(tr.cells[4].innerHTML),pltQty:parseInt(outCountC[keyValue]["pltQty"])+parseInt(tr.cells[5].innerHTML),count:parseInt(outCountC[keyValue]["count"])+1};
                                        }
                                    }
                                }
                                
                               
                            }else{
                                const tr=document.createElement("tr");
                                for(let k in key_f){
                                    const td=document.createElement("td");
                                    td.innerHTML=cargo[j][key_f[k]];
                                    tr.appendChild(td);
                                }
                                const keyValue=tr.cells[0].innerHTML+"_"+tr.cells[1].innerHTML+"_"+tr.cells[2].innerHTML;
                                if(cargo[j]["workprocess"]=="미"){
                                tbodyP.appendChild(tr);
                                if(outCountP[keyValue]==undefined){
                                    outCountP[keyValue]={eaQty:tr.cells[4].innerHTML,pltQty:tr.cells[5].innerHTML,count:1};
                                }else{
                                    outCountP[keyValue]={eaQty:parseInt(outCountP[keyValue]["eaQty"])+parseInt(tr.cells[4].innerHTML),pltQty:parseInt(outCountP[keyValue]["pltQty"])+parseInt(tr.cells[5].innerHTML),count:parseInt(outCountP[keyValue]["count"])+1};
                                }
                                }else if(cargo[j]["workprocess"]=="완"){
                                tbodyC.appendChild(tr);
                                if(outCountC[keyValue]==undefined){
                                    outCountC[keyValue]={eaQty:tr.cells[4].innerHTML,pltQty:tr.cells[5].innerHTML,count:1};
                                }else{
                                    outCountC[keyValue]={eaQty:parseInt(outCountC[keyValue]["eaQty"])+parseInt(tr.cells[4].innerHTML),pltQty:parseInt(outCountC[keyValue]["pltQty"])+parseInt(tr.cells[5].innerHTML),count:parseInt(outCountC[keyValue]["count"])+1};
                                }
                            }
                            }
                    }
                }
            };
        };
        for(let p in outCountP){
            const tbody=document.getElementById("outPreTotal");
            const tr=document.createElement("tr");
            const totalList= p.split("_");
            for(let t in totalList){
                const td=document.createElement("td");
                td.innerHTML=totalList[t];
                tr.appendChild(td);
            }
            const count=document.createElement("td");
            count.innerHTML=outCountP[p]["count"];
            tr.appendChild(count);
            const tdEa=document.createElement("td");
            tdEa.innerHTML=outCountP[p]["eaQty"];
            tr.appendChild(tdEa);
            const tdPl=document.createElement("td");
            tdPl.innerHTML=outCountP[p]["pltQty"];
            tr.appendChild(tdPl);

            tbody.appendChild(tr);
        }
        for(let k in outCountC){
            const trId=k.substring(11,);
            const tr=document.getElementById(trId);
            if(tr!=null){
            const tdOutEa=document.createElement("td");
            tdOutEa.innerHTML=outCountC[k]["eaQty"];
            tr.appendChild(tdOutEa);
            const tdOutPl=document.createElement("td");
            tdOutPl.innerHTML=outCountC[k]["pltQty"];
            tr.appendChild(tdOutPl);
            const totalEa=document.createElement("td");
            totalEa.innerHTML=parseInt(tr.cells[3].innerHTML)-parseInt(tdOutEa.innerHTML);
            tr.appendChild(totalEa);
            const totalPl=document.createElement("td");
            totalPl.innerHTML=parseInt(tr.cells[4].innerHTML)-parseInt(tdOutPl.innerHTML);
            tr.appendChild(totalPl);

            const tbody=document.getElementById("outCompleteTotal");
            const trT=document.createElement("tr");
            const totalList= k.split("_");
            for(let t in totalList){
                const td=document.createElement("td");
                td.innerHTML=totalList[t];
                trT.appendChild(td);
            }
            const count=document.createElement("td");
            count.innerHTML=outCountC[k]["count"];
            trT.appendChild(count);
            const tdEa=document.createElement("td");
            tdEa.innerHTML=outCountC[k]["eaQty"];
            trT.appendChild(tdEa);
            const tdPl=document.createElement("td");
            tdPl.innerHTML=outCountC[k]["pltQty"];
            trT.appendChild(tdPl);

            tbody.appendChild(trT);
            }
        }
    }}
    );
}
function searchDate(){
    console.log("searchDate")
    const sDate=document.getElementById("startDate").value;
    const eDate=document.getElementById("endDate").value;
    if(sDate==""||eDate==""){
        alert("날짜를 입력해주세요");
        return;
    }
    document.getElementById("outPreTableTbody").replaceChildren();
    document.getElementById("outCompleteTableTbody").replaceChildren();
    // initLogTableTbody(sDate,eDate);
}
function regData(){
    const trValue=document.querySelectorAll("#trReg input");
    const thValue= document.querySelectorAll("#trReg h5");
    let promptContent="";
    for(let i=0;i<trValue.length;i++){
        if(i==0){
            promptContent=thValue[i].innerText+":"+trValue[i].value;
        
        }else{
            promptContent=promptContent+"\n"+thValue[i].innerText+":"+trValue[i].value;
        }
    }
    confirm(promptContent+"\n"+"위 내용으로 등록하시겠습니까?");
    if(confirm){
    let upLoadValue={};
    database_f.ref("DeptName/"+deptName+"/InCargo/").get().then((snapshot)=>{
        //snapshot 하위노드의 값 가져오기
        const val=snapshot.val();
        for(let i in val){
           const val1=val[i];
           for(let j in val1){
              for(let k in val1[j]){
                const data=val1[j][k];
                if(data["consignee"]==consigneeName&&data["date"]==clickValue[0]&&data["bl"]==clickValue[1]&&data["description"]==clickValue[2]){
                    const month = data["date"].substring(5,7)+"월";
                    const key="DeptName/"+deptName+"/InCargo/"+month+"/"+clickValue[0]+
                    "/"+clickValue[0]+"_"+clickValue[1]+"_"+clickValue[2]+"_"+data["count"]+"_"+data["container"];
                    database_f.ref(key).update({date:trValue[0].value,bl:trValue[1].value,description:trValue[2].value,remark:trValue[3].value}).then(()=>{console.log("upload Succecced")}).catch((e)=>{console.log(e)});
                };
           }
        }}
    });
        initDataTableTbody();
    }
}
function outC(){
    const comDiv=document.getElementById("outCompleteTableDiv");
    comDiv.classList.toggle("hidden");
    const preDiv=document.getElementById("outPreTableDiv");
    preDiv.classList.toggle("hidden");
}
function regPLT(){
    const date = document.getElementById("pltDate").value;
    const type = document.getElementsByClassName("inplt")[1].value;
    const inNum = document.getElementsByClassName("inplt")[2].value;
    const outNum = document.getElementsByClassName("inplt")[3].value;
    const re = document.getElementsByClassName("inplt")[4].value;
    const data = {
        date : date,
        type : type,
        inNum : inNum,
        outNum : outNum,
        re : re
    }
    console.log(data);
}
