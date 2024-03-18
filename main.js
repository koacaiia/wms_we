
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
let outKeyPath="";
let outTrClickValu=[];
let outStockValue={};
let outPupInputList=[];
const key_f=["date","managementNo","description","outwarehouse","eaQty","pltQty","remark"];
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
pltStock();
function pltStock(){
    database_f.ref("DeptName/"+deptName+"/PltManagement/"+consigneeName+"/").get().then((snapshot)=>{
        let pltList={}
        const val=snapshot.val();
        for(let i in val){
            const valD=val[i];
            for(let j in valD){
                if(pltList.length==undefined){
               pltList[valD[j]["type"]]={in:valD[j]["inNum"],out:valD[j]["outNum"],re:valD[j]["re"]};
            }
            else{
            pltList[valD[j]["type"]]={in:parseInt(pltList[valD[j]["type"]]["in"])+parseInt(valD[j]["inNum"]),out:parseInt(pltList[valD[j]["type"]]["out"])+parseInt(valD[j]["outNum"]),re:parseInt(pltList[valD[j]["type"]]["re"])+parseInt(valD[j]["re"])};
            }
        }
    }
    let stockTitle="";
    for(let i in pltList){
         const stock=parseInt(pltList[i]["in"])-parseInt(pltList[i]["out"]);
         stockTitle=stockTitle+i+" : "+stock+"장 ,";
    }
    document.getElementById("pltStock").innerHTML=stockTitle.substring(0,stockTitle.length-1);
    });
   
}        
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
                    console.log(document.getElementById("trReg").children[i].children[1]);
                    
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
initLogTableTbody(transDate(new Date()),transDate(new Date()),"init");  
function initLogTableTbody(sDate,eDate,init){
    const tbodyP=document.getElementById("outPreTableTbody");
    const tbodyC=document.getElementById("outCompleteTableTbody");
    database_f.ref("DeptName/"+deptName+"/OutCargo/").get().then((snapValue)=>{
        const snap=snapValue.val();
        let snapshot={};
        for(let s in snap){
            if(s.length<4){
                const shot=Object.values(snap[s]);
                for(let a in shot){
                    const value=Object.values(shot[a]);
                    const key=Object.keys(shot[a]);
                    snapshot[key]=value;
                }
            }
        }
        // console.log(snapshot);
            let data = Object.values(snapshot);
            let keys = Object.keys(data);
            for(let i=0;i<keys.length;i++){
                let key = keys[i];
                let cargo = data[key];
                if(Object.keys(cargo)!= "json 등록시 덥어쓰기 바랍니다"){
                    for(let j in cargo){
                        
                        if(cargo[j]["consigneeName"]==consigneeName){
                            const  dateCheck=cargo[j]["date"]>=sDate;
                            const dateCheck2=cargo[j]["date"]<=eDate;
                            if(cargo[j]["managementNo"].includes(",")){
                                const no=cargo[j]["managementNo"].split(",");
                                const desc=cargo[j]["description"].split(",");
                                const ea=cargo[j]["eaQty"].split(",");
                                const pl=cargo[j]["pltQty"].split(",");
                                if(cargo[j]["remark"]==undefined){
                                    cargo[j]["remark"]=" ";
                                };
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
                                    tdW.innerHTML=cargo[j]["remark"];
                                    tr.appendChild(tdW);
                                    tr.appendChild(tdW);
                                    tr.setAttribute("id",cargo[j]["keypath"]+"_"+cargo[j]["workprocess"]);
                                    const keyValue=tr.cells[0].innerHTML+"_"+tr.cells[1].innerHTML+"_"+tr.cells[2].innerHTML;
                                        if(cargo[j]["workprocess"]=="미"){
                                            tr.setAttribute("class","outP"); 
                                            if(dateCheck&&dateCheck2){
                                                tbodyP.appendChild(tr);
                                                if(outCountP[keyValue]==undefined){
                                                    outCountP[keyValue]={eaQty:tr.cells[4].innerHTML,pltQty:tr.cells[5].innerHTML,count:1};
                                                }else{
                                                    outCountP[keyValue]={eaQty:parseInt(outCountP[keyValue]["eaQty"])+parseInt(tr.cells[4].innerHTML),pltQty:parseInt(outCountP[keyValue]["pltQty"])+parseInt(tr.cells[5].innerHTML),count:parseInt(outCountP[keyValue]["count"])+1};
                                                }
                                            }  
                                        
                                        tr.addEventListener("click",function(e){
                                            outTrClick(e);
                                        });
                                        }else if(cargo[j]["workprocess"]=="완"){
                                        tr.setAttribute("class","outC"); 
                                        if(dateCheck&&dateCheck2){
                                            tbodyC.appendChild(tr);
                                            if(outCountC[keyValue]==undefined){
                                                outCountC[keyValue]={eaQty:tr.cells[4].innerHTML,pltQty:tr.cells[5].innerHTML,count:1};
                                            }else{
                                                outCountC[keyValue]={eaQty:parseInt(outCountC[keyValue]["eaQty"])+parseInt(tr.cells[4].innerHTML),pltQty:parseInt(outCountC[keyValue]["pltQty"])+parseInt(tr.cells[5].innerHTML),count:parseInt(outCountC[keyValue]["count"])+1};
                                            }
                                        }   
                                        
                                        tr.addEventListener("click",function(e){
                                            outTrClick(e);
                                        });
                                    }
                                }
                                
                               
                            }else{
                                const tr=document.createElement("tr");
                                for(let k in key_f){
                                    const td=document.createElement("td");
                                    if(k==key_f.length-1&&cargo[j]["remark"]==undefined){
                                        cargo[j]["remark"]=" ";
                                    };
                                    td.innerHTML=cargo[j][key_f[k]];
                                    tr.setAttribute("id",cargo[j]["keypath"]+"_"+cargo[j]["workprocess"]);
                                    tr.appendChild(td);
                                }
                                const keyValue=tr.cells[0].innerHTML+"_"+tr.cells[1].innerHTML+"_"+tr.cells[2].innerHTML;
                                const idValue=tr.cells[1].innerHTML+"_"+tr.cells[2].innerHTML;
                                if(cargo[j]["workprocess"]=="미"){
                                tr.setAttribute("class","outP");    
                                if(dateCheck&&dateCheck2){
                                    tbodyP.appendChild(tr);
                                    if(outCountP[keyValue]==undefined){
                                        outCountP[keyValue]={eaQty:tr.cells[4].innerHTML,pltQty:tr.cells[5].innerHTML,count:1};
                                    }else{
                                        outCountP[keyValue]={eaQty:parseInt(outCountP[keyValue]["eaQty"])+parseInt(tr.cells[4].innerHTML),pltQty:parseInt(outCountP[keyValue]["pltQty"])+parseInt(tr.cells[5].innerHTML),count:parseInt(outCountP[keyValue]["count"])+1};
                                    }
                                }  
                                
                                }else if(cargo[j]["workprocess"]=="완"){
                                tr.setAttribute("class","outC");
                                if(dateCheck&&dateCheck2){
                                    tbodyC.appendChild(tr);
                                    if(outCountC[keyValue]==undefined){
                                        outCountC[keyValue]={eaQty:tr.cells[4].innerHTML,pltQty:tr.cells[5].innerHTML,count:1};
                                    }else{
                                        outCountC[keyValue]={eaQty:parseInt(outCountC[keyValue]["eaQty"])+parseInt(tr.cells[4].innerHTML),pltQty:parseInt(outCountC[keyValue]["pltQty"])+parseInt(tr.cells[5].innerHTML),count:parseInt(outCountC[keyValue]["count"])+1};
                                    }
                                    
                                }     
                                if(outStockValue[idValue]==undefined){
                                    outStockValue[idValue]={eaQty:tr.cells[4].innerHTML,pltQty:tr.cells[5].innerHTML};}
                                else{
                                    outStockValue[idValue]={eaQty:parseInt(outStockValue[idValue]["eaQty"])+parseInt(tr.cells[4].innerHTML),pltQty:parseInt(outStockValue[idValue]["pltQty"])+parseInt(tr.cells[5].innerHTML)};}
                            }
                            
                            tr.addEventListener("click",function(e){
                                outTrClick(e);
                            });
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
        if(init=="init"){
            if(document.title=="Web"){
            for(let k in outStockValue){
                const trId=k;
                const tr=document.getElementById(trId);
                if(tr!=null){
                const tdOutEa=document.createElement("td");
                if(tdOutEa.innerHTML==""){
                    tdOutEa.innerHTML=outStockValue[k]["eaQty"];
                }else{
                    tdOutEa.innerHTML=parseInt(tdOutEa.innerHTML)+parseInt(outStockValue[k]["eaQty"]);
                }
                tr.appendChild(tdOutEa);
                const tdOutPl=document.createElement("td");
                if(tdOutPl.innerHTML==""){
                    tdOutPl.innerHTML=outStockValue[k]["pltQty"];}
                else{ 
                tdOutPl.innerHTML=parseInt(tdOutPl.innerHTML)+parseInt(outStockValue[k]["pltQty"]);}
                tr.appendChild(tdOutPl);
                const totalEa=document.createElement("td");
                totalEa.innerHTML=parseInt(tr.cells[3].innerHTML)-parseInt(tdOutEa.innerHTML);
                tr.appendChild(totalEa);
                const totalPl=document.createElement("td");
                totalPl.innerHTML=parseInt(tr.cells[4].innerHTML)-parseInt(tdOutPl.innerHTML);
                tr.appendChild(totalPl);
                }}
        }}

       
            const tbodyTc=document.getElementById("outCompleteTotal");
            for(let k in outCountC){
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
                tbodyTc.appendChild(trT);
            }
        }
    
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
    initLogTableTbody(sDate,eDate);
}
function searchDateAll(){
    const eDate=new Date();
    let newDay=new Date(eDate)
    newDay.setDate(eDate.getDate()+3);
    document.getElementById("outPreTableTbody").replaceChildren();
    document.getElementById("outCompleteTableTbody").replaceChildren();
    initLogTableTbody("2024-02-01",transDate(newDay));
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
    let con=confirm(promptContent+"\n"+"위 내용으로 등록하시겠습니까?");
    if(con){
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
                    database_f.ref(key).update({date:trValue[0].value,bl:trValue[1].value,description:trValue[2].value,remark:trValue[3].value}).then(()=>{location.reload();
                    }).catch((e)=>{console.log(e)});
                };
           }
        }}
    });
    
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
    let inNum = document.getElementsByClassName("inplt")[2].value;
    if(inNum==""){
        inNum=0;}
    let outNum = document.getElementsByClassName("inplt")[3].value;
    if(outNum==""){
        outNum=0;}
    const re = document.getElementsByClassName("inplt")[4].value;
    const data = {
        date : date,
        type : type,
        inNum : inNum,
        outNum : outNum,
        re : re
    }
    const key="DeptName/"+deptName+"/PltManagement/"+consigneeName+"/"+type+"/"+date;
    database_f.ref(key).update(data).then(()=>{location.reload()}).catch((e)=>{alert("팔렛트 등록정보 실패",e)});
}
function popPlt(){    
    const popup = document.getElementById('pltRegDiv');
    // popup.classList.toggle("pop");
    // 스타일을 지정하여 팝업을 꾸밀 수 있습니다.
    popup.style.position = "fixed";
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '20px';
    popup.style.border = '2px solid black';
    popup.style.borderRadius = '10px';
    popup.style.display ="grid";
    popup.style.gridTemplateRows="1fr 1fr 1fr";

    // body 요소에 팝업 요소를 추가
    // document.body.appendChild(popup);
}
function regPltCancel(){
    const popup = document.getElementById('pltRegDiv');
    popup.style.display = "none";
}
function outRegCancel(){
    const popup = document.getElementById('outTrClick');
    popup.style.display = "none";
}
document.getElementById("pltType").addEventListener("change",function(){
    const type=document.getElementById("pltType");
    document.getElementsByClassName("inplt")[1].value=type.value;
    type.value="1"

});
function pltDetail(){
    alert("작업 진행중입니다.");
}
function btnOutDown(){
    alert("작업 진행중입니다.");
}
function btnStock(){
    alert("작업 진행중입니다.");
}
function outTrClick(e){
    
        const popup = document.getElementById('outTrClick');
        const clickTr = e.target.parentNode;
        if(clickTr.classList.value=="outP"){
            popup.querySelector("h5").innerHTML="출고 예정내용 수정";
        }else{
            popup.querySelector("h5").innerHTML="출고 완료내용 수정";
        }
        const trList = clickTr.querySelectorAll("td");
        popup.style.position = 'fixed';
        popup.style.top = '30%';
        popup.style.left = '70%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'white';
        popup.style.padding = '20px';
        popup.style.border = '2px solid black';
        popup.style.borderRadius = '10px';
        popup.style.display ="grid";
        popup.style.gridTemplateRows="1fr 1fr 1fr";
        const popInputList = popup.querySelectorAll("input");
        for(let t=0;t<trList.length;t++){
            popInputList[t].value=trList[t].innerHTML;
            outPupInputList.push(popInputList[t].value);
        }
        const date=trList[0].innerHTML;
        const trPath=clickTr.id;
        outKeyPath="DeptName/"+deptName+"/OutCargo/"+date.substring(5,7)+"월/"+date+"/"+trPath;
        console.log("outTrClicked",outPupInputList)
}
function outDataDel(){
    let con=confirm("해당 내용을 삭제하시겠습니까?");
    if(con){
        database_f.ref(outKeyPath.substring(0,outKeyPath.length-2)).remove().then(()=>{location.reload();console.log("delete Succecced")}).catch((e)=>{console.log(e)});
        outRegCancel();
    }
    
}
function outStatusChange(){
    const status=outKeyPath.substring(outKeyPath.length-1,);
    let workprocess={};
    let confirmMsg="";
    if(status=="미"){
        workprocess={workprocess:"완"};
        confirmMsg="출고 예정 건을 출고 완료로 변경 합니다.";
    }else if(status=="완"){
        workprocess={workprocess:"미"};
        confirmMsg="출고 완료 건을 출고 예정으로 변경 합니다.";
    }
    let con=confirm(confirmMsg);
    if(con){
        database_f.ref(outKeyPath.substring(0,outKeyPath.length-2)).update(workprocess).then(()=>{location.reload()}).catch((e)=>{alert(e)});
        
    }
}
function outDataChange(){
    console.log("onDataChangeed",outPupInputList)
    const popup = document.getElementById('outTrClick');
    const popInputList = popup.querySelectorAll("input");
    let trValue=[];
    for(let t=0;t<popInputList.length;t++){
        trValue.push(popInputList[t].value);
    }
    const data = {
        date : trValue[0],
        managementNo : trValue[1],
        description : trValue[2],
        outwarehouse : trValue[3],
        eaQty : trValue[4],
        pltQty : trValue[5],
        remark : trValue[6]
    }
    let confirmMsg="변경된 내용을 저장하시겠습니까?";
    for(let k=0;k<outPupInputList.length;k++){
        const changeKey=outPupInputList[k]==Object.values(data)[k];
        console.log(changeKey)
        console.log(outPupInputList[k],Object.values(data)[k])
        if(changeKey==false){
            confirmMsg=Object.keys(data)[k]+"  :  "+outPupInputList[k]+"=>"+Object.values(data)[k]+"\n"+confirmMsg;
        }
        
    };
    let con=confirm(confirmMsg);
    if(con){
        console.log("confirm Checked ","OK")
        // database_f.ref(outKeyPath.substring(0,outKeyPath.length-2)).update(data).then(()=>{console.log("upload Successed");location.reload();}).catch((e)=>{alert(e)});
    }
}
// const mobileCheck = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i);


const mobileCheck=/Android|iPhone/i.test(navigator.userAgent);
console.log(mobileCheck);
if(mobileCheck&&document.title=="Web"){
    alert("모바일 환경에서는 사용이 제한됩니다.");
    // window.location.href="mobile.html";
    window.open("mobile.html");
}
if(mobileCheck){
    const tbody=document.getElementById("dataTableTbody");
    const trList=tbody.querySelectorAll("tr");
    console.log(trList);
    trList.cells[3].style.display="none";
    trList.cells[4].style.display="none";
    trList.cells[6].style.display="none";
    trList.cells[7].style.display="none";
    
}