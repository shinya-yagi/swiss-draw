//変数宣言
let battle_histories = {};
let playerNames = [];
let table = document.getElementById('list-form');
let scoretable = document.getElementById('score');

//選手リスト
function insertRow() {

    // 行を行末に追加
    let row = table.insertRow(-1);
    // セルの挿入
    let cell1 = row.insertCell(-1);
    let cell2 = row.insertCell(-1);

    //id追加
    let i = table.rows.length ;

    // セルの内容入力
    cell1.innerHTML = i;
    cell2.innerHTML = '<input type="text" class="playernametext" name="name" id="playername'+i+'">';
}

//削除ボタン
function deleteRow() {
    let row_len = table.rows.length;
    table.deleteRow(row_len-1);
}

//１回戦へ
function scoreSheet() {
    for (let i = 0; i < table.rows.length; i++){
        let name = document.getElementById('playername'+(i+1)).value;
        if(name===""){
           alert("選手名が入力されていない箇所があります");
           return;
        }
    }
    
    for (let i = 0; i < table.rows.length; i++) {
        playerNames.push(document.getElementById('playername'+(i+1)).value);
        let playerName = document.getElementById('playername'+(i+1)).value;
        battle_histories[playerName] = {
            histories: [],
            score: 0,
            opp: 0,
        };
    }
    
    //奇数の場合
    let playernumbers = table.rows.length;
    if( ( playernumbers % 2 ) != 0 ) {
        battle_histories['bye'] = {
            histories: [],
            score: 0,
            opp: 0,
        };
        playerNames.push('bye');
    }

    //配列をランダムシャッフル
    for(let i = playerNames.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = playerNames[i];
        playerNames[i] = playerNames[j];
        playerNames[j] = tmp;
    }
    
    //スコアシート作成
    for (let i = 0; i < playerNames.length; i += 2) {
        // 行を行末に追加
        let row = scoretable.insertRow(-1);
        // セルの挿入
        let cell1 = row.insertCell(-1);
        let cell2 = row.insertCell(-1);
        let cell3 = row.insertCell(-1);
        let cell4 = row.insertCell(-1);
        let cell5 = row.insertCell(-1);
        let cell6 = row.insertCell(-1);
        
        // ボタン用 HTML
        let leftradio = '<select id="leftpoint' + i/2 +'"  name="kind"><option value="2">'+'2'+'</option>'+'<option value="1">'+'1'+'</option>'+'<option value="0">'+'0'+'</option>'+'</select>';
        let rightradio = '<select id="rightpoint' + i/2 +'"  name="kind"><option value="2">'+'2'+'</option>'+'<option value="1">'+'1'+'</option>'+'<option value="0">'+'0'+'</option>'+'</select>';

        // セルの内容入力
        cell1.innerHTML = i/2+1;
        cell2.innerHTML = playerNames[i];
        cell3.innerHTML = leftradio;
        cell4.innerHTML = 'vs';
        cell5.innerHTML = playerNames[i+1];
        cell6.innerHTML = rightradio;
        
        //対戦履歴に記録
        let leftPlayerName = playerNames[i];
        let rigthPlayerName = playerNames[i+1];
        battle_histories[leftPlayerName]['histories'].push(rigthPlayerName);
        battle_histories[rigthPlayerName]['histories'].push(leftPlayerName);
    }
    
    //byeの時の勝ち点固定
    for(let i = 1; i < scoretable.rows.length; i++ ){
        let leftName =scoretable.rows[i].cells[1].innerText; 
        let rightName =scoretable.rows[i].cells[4].innerText; 
        let leftpoint = document.getElementById('leftpoint'+(i-1));
        let rightpoint = document.getElementById('rightpoint'+(i-1));

        if(leftName === 'bye'){
            leftpoint.innerHTML = '<select id=' + leftpoint + ' name="kind"><option value="0">'+'0'+'</option>'+'</select>';
        }
        
        if(rightName === 'bye'){
            rightpoint.innerHTML = '<select id=' + rightpoint + ' name="kind"><option value="0">'+'0'+'</option>'+'</select>';
        }
    }
    
    //ボタン切り替え
    document.getElementById("resultbutton").disabled ="";
    document.getElementById("nextbutton").disabled ="disabled";
    document.getElementById("addbutton").disabled ="disabled";
    document.getElementById("firstbutton").disabled ="disabled";
    document.getElementById("deletebutton").disabled ="disabled";
}

//結果報告
function result(){
    //勝ち点が2-2,0-0,0-1,1-0の時にアラート
    for (let i = 1; i < scoretable.rows.length; i++){
        let leftpoint = document.getElementById('leftpoint'+(i-1)).value;
        let rightpoint = document.getElementById('rightpoint'+(i-1)).value;
        if((leftpoint==2 && rightpoint==2)||(leftpoint==0 && rightpoint==0)||(leftpoint==1 && rightpoint==0)||(leftpoint==0 && rightpoint==1)){
           alert("不正な勝ち点が入力されています");
           return;
        }
    }
    
    //バトルヒストリー更新
    let keys = Object.keys(battle_histories);
    //スコア加算
    for (let i = 1; i < scoretable.rows.length; i++ ) {
        let leftPlayerName =scoretable.rows[i].cells[1].innerText; //左側のプレイヤー名定義
        let rightPlayerName =scoretable.rows[i].cells[4].innerText; //右側のプレイヤー名定義

        let leftscorecells = scoretable.rows[i].cells[2].getElementsByTagName('select')[0].value; //左側プレイヤーの勝ち点定義 
        let rightscorecells = scoretable.rows[i].cells[5].getElementsByTagName('select')[0].value; //右側プレイヤーの勝ち点定義

        //左側プレイヤーのバトルヒストリー・スコアに左側の勝ち点を加算
        battle_histories[leftPlayerName]['score'] += parseFloat(leftscorecells); 
        
        //右側プレイヤーのバトルヒストリー・スコアに右側の勝ち点を加算
        battle_histories[rightPlayerName]['score'] += parseFloat(rightscorecells);
    }
    
    //oppを加算
    for (let i = 0; i < keys.length; i++ ) {
        let key = keys[i];
        let histories = battle_histories[key]['histories'];
        battle_histories[key][`opp`] = 0;
        for (let j = 0; j < histories.length; j++ ) {
            let enemy = histories[j];//aaaのバトルヒストリーから対戦した相手の名前を呼び出し
            let opp = battle_histories[enemy]['score'];//対戦した相手の勝ち点を呼び出し
            battle_histories[key][`opp`] += parseFloat(opp);//aaaのoppに対戦相手の勝ち点を加算
        }
    }
    
    let resultarray = Array(keys.length);
    for (let i = 0; i < keys.length; i++ ) {
        resultarray[i] = [];
        let key = keys[i];
        resultarray[i].push(key);
        resultarray[i].push(battle_histories[key][`score`]);
        resultarray[i].push(battle_histories[key][`opp`]);
    }

    //2列目（スコア）と3列目（opp）で降順にソートする
    resultarray.sort((a, b) => {
    if (a[1] < b[1]) return 1;
    if (a[1] > b[1]) return -1;
    if (a[2] < b[2]) return 1;
    if (a[2] > b[2]) return -1;
    return 0;
    });

    //成績表記録
    let resulttable = document.getElementById('resulttable');
    while(resulttable.rows[1])resulttable.deleteRow(1); //成績表のth以外を全て削除

    for (let i = 0; i < keys.length; i++){
        // 行を行末に追加
        let row = resulttable.insertRow(-1);
        // セルの挿入
        let cell1 = row.insertCell(-1);
        let cell2 = row.insertCell(-1);
        let cell3 = row.insertCell(-1);
        // セルの内容入力
        cell1.innerHTML = resultarray[i][0];
        cell2.innerHTML = resultarray[i][1];
        cell3.innerHTML = resultarray[i][2];
    }

    //ボタン切り替え
    document.getElementById("nextbutton").disabled ="";
    document.getElementById("resultbutton").disabled ="disabled";
}

//次の対戦
function nextgame(){
    let nextgamearray =[];
    let scores = {}; //scoresという空のオブジェクトを作成
    let keys = Object.keys(battle_histories);//バトルヒストリーからプレイヤー名を取り出して、keysという名の配列に格納

    while( scoretable.rows[1])scoretable.deleteRow(1); //スコアシートのth以外を全て削除
    
    for (let i = 0; i < keys.length; i++) { //keysオブジェクトに格納されているプレイヤー名の数だけ繰り返す
        let key = keys[i]; //keys[i]のi番目のプレイヤー名をkeyと名付ける 
        let obj = battle_histories[key]; //objとは、バトルヒストリーオブジェクト上のkey選手（keysのi番目）
        let score = obj.score; //スコアとは、objのscoreデータ（keysi番目の選手のスコア）
        if (!scores[score]) { //もし、scoresオブジェクト{}にi番目の選手のスコアが格納されていないなら、
            scores[score] = []; //そのスコア値をタイトルとする配列を作成する(0という名前の配列)
        }
            scores[score].push(key); //scoresオブジェクト{}のi番目の選手のスコア値をタイトルとする配列にi番目の選手名を格納する。
                                     // 0という名の配列にaaaを格納する
    }

    //勝ち点ごとの配列に格納された選手たちを、一つの配列に格納
    let scoreskeys = Object.keys(scores);//scoresオブジェクトのkeyで配列を作る[0,2]
    for (let i = 0; i < scoreskeys.length; i++) { //keyの数だけ繰り返す 2回
        let scoreskey = scoreskeys[i]; //scoreskeysのi番目=0
        let players = scores[scoreskey]; //scores[0]=[a,b,c,d]
        
        for(let k = players.length - 1; k > 0; k--) { //配列をランダムシャッフル
            let j = Math.floor(Math.random() * (k + 1));
            let tmp = players[k];
            players[k] = players[j];
            players[j] = tmp;
        }
        
        for (let j = 0; j < players.length; j++) { 
            nextgamearray.push(players[j]); //aをプッシュ
        }
    }
    
    //スコアシート作成
    for(let i = 0; i < nextgamearray.length; i+=2) { 
        // 行を行末に追加
        let row = scoretable.insertRow(-1);
        // セルの挿入
        let cell1 = row.insertCell(-1);
        let cell2 = row.insertCell(-1);
        let cell3 = row.insertCell(-1);
        let cell4 = row.insertCell(-1);
        let cell5 = row.insertCell(-1);
        let cell6 = row.insertCell(-1);
            
        // ボタン用 HTML
        let leftradio = '<select id="leftpoint' + i/2 +'"  name="kind"><option value="2">'+'2'+'</option>'+'<option value="1">'+'1'+'</option>'+'<option value="0">'+'0'+'</option>'+'</select>';
        let rightradio = '<select id="rightpoint' + i/2 +'"  name="kind"><option value="2">'+'2'+'</option>'+'<option value="1">'+'1'+'</option>'+'<option value="0">'+'0'+'</option>'+'</select>';

        // セルの内容入力
        cell1.innerHTML = i/2+1;
        cell2.innerHTML = nextgamearray[i];
        cell3.innerHTML = leftradio;
        cell4.innerHTML = 'vs';
        cell5.innerHTML = nextgamearray[i+1];
        cell6.innerHTML = rightradio;
        
        //対戦履歴に記録
        let leftPlayerName = nextgamearray[i];
        let rigthPlayerName = nextgamearray[i+1];
            
        battle_histories[leftPlayerName]['histories'].push(rigthPlayerName);
        battle_histories[rigthPlayerName]['histories'].push(leftPlayerName);
    }
    
    //byeの時の勝ち点固定
    for(let i = 1; i < scoretable.rows.length; i++ ){
        let leftName =scoretable.rows[i].cells[1].innerText; 
        let rightName =scoretable.rows[i].cells[4].innerText; 
        let leftpoint = document.getElementById('leftpoint'+(i-1));
        let rightpoint = document.getElementById('rightpoint'+(i-1));

        if(leftName === 'bye'){
            leftpoint.innerHTML = '<select id=' + leftpoint + ' name="kind"><option value="0">'+'0'+'</option>'+'</select>';
        }
        
        if(rightName === 'bye'){
            rightpoint.innerHTML = '<select id=' + rightpoint + ' name="kind"><option value="0">'+'0'+'</option>'+'</select>';
        }
    }
    
    //ボタン切り替え
    document.getElementById("resultbutton").disabled ="";
    document.getElementById("nextbutton").disabled ="disabled";
    
    //回戦数加算
    let battle_number = document.getElementById("battle_number");
    let sampleplayer = nextgamearray[1];
    let battle_count = battle_histories[sampleplayer]['histories'].length;
    battle_number.innerHTML = '<li id="battle_number">' + battle_count + '</li>' ;
}