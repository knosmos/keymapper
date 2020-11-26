keys = [
    [['~',1],['1',1],['2',1],['3',1],['4',1],['5',1],['6',1],['7',1],['8',1],['9',1],['0',1],['_',1],['+',1],['back',1]],
    [['tab',1],['Q',1],['W',1],['E',1],['R',1],['T',1],['Y',1],['U',1],['I',1],['O',1],['P',1],['[',1],[']',1],['\\',1]],
    [['caps',1],['A',1],['S',1],['D',1],['F',1],['G',1],['H',1],['J',1],['K',1],['L',1],[';',1],['"',1],['enter',2]],
    [['lshift',2],['Z',1],['X',1],['C',1],['V',1],['B',1],['N',1],['M',1],[',',1],['.',1],['?',1],['rshift',2]],
    [['ctrl',2],['win',1],['alt',1],['space',6],['left',1],['down',1],['up',1],['right',1]]
]

var rows = 5;
var cols = 14;

data = {'placeholder':0};
let lcolor = [42, 19, 82];
let hcolor = [219, 39, 105];

main = document.getElementById("keyboard");

function setupKeyboard(){
    main.style.gridTemplateColumns = `repeat(${cols},minmax(0px,1fr))`;
    for (let row of keys){
        for (let key of row){
            main.innerHTML += `<div id='${key[0]}' style="grid-column: span ${key[1]}; background-color: rgb(${lcolor[0]},${lcolor[1]},${lcolor[2]})" class="keyboardbutton">${key[0]}</div>`;
        }
    }
}

function record(event){ // Logs a keypress event
    var key = event.which || event.keyCode;
    console.log(key);
    specialCodes = {
        "9":"tab","20":"caps","16":"rshift","8":"back","91":"win",
        "18":"alt","17":"ctrl","13":"enter","37":"left","38":"up",
        "40":"down","39":"right","192":"~","188":",","190":".","191":"?",
        "186":";","222":'"',"219":"[","221":"]","220":"\\","189":"_","187":"+"
    };
    if (Object.keys(specialCodes).includes(key.toString())){
        key = specialCodes[key.toString()];
        console.log(key);
    }
    else{
        key = String.fromCharCode(key)
        key = key.toUpperCase();
        replaces = {
            '`':'~','!':'1','@':'2','#':'3','$':'4','%':'5','^':'6','&':'7','*':'8','(':'9',')':'0','-':'_','=':'+','backspace':'back',
            '{':'[','}':']','|':'\\',
            'caps lock':'caps',':':';','\'':'"',
            'shift':'lshift','<':',','>':'.','/':'?','right shift':'rshift',
            'right alt':'alt','left windows':'win'," ":"space" // This is copied from the Python version; the JS version doesn't record non-char keys.
        };
        if (Object.keys(replaces).includes(key)){
            key = replaces[key];
        }
    }
    if (Object.keys(data).includes(key)){
        data[key] += 1;
    }
    else{
        data[key] = 1;
    }
    if (key == "rshift"){ data["lshift"] = data["rshift"] } // We can only detect one shift key
    updateKeyboard();
    updateFreqBars();
}

function erase(){
    data = {'placeholder':0};
    updateKeyboard();
    setupFreqBars();
}

function colorRamp(heat){
    return [
        (hcolor[0]-lcolor[0])*heat+lcolor[0],
        (hcolor[1]-lcolor[1])*heat+lcolor[1],
        (hcolor[2]-lcolor[2])*heat+lcolor[2]
    ]
}

function updateKeyboard(){
    let maxkeypresses = Math.max(...Object.values(data));
    for (let row of keys){
        for (let key of row){
            let heat = 0;
            if (Object.keys(data).includes(key[0])){
                heat = Math.pow(data[key[0]]/maxkeypresses,0.4);
            }
            let color = colorRamp(heat);
            document.getElementById(key[0]).style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]})`;
        }
    }
}

function setupFreqBars(){
    let d = document.getElementById("freqencies");
    d.innerHTML = "";
    for (let row of keys){
        for (let key of row){
            d.innerHTML += `<div class="freqbar" id="freq-${key[0]}"></div>`;
        }
    }
}

function compare(a,b){
    if (a[1]<b[1]){
        return 1;
    }
    if (a[1]>b[1]){
        return -1;
    }
    return 0;
}

function updateFreqBars(){
    let maxkeypresses = Math.max(...Object.values(data));
    let sortedData = Object.entries(data);
    sortedData.sort(compare);
    let totalSum = Object.values(data).reduce(function(a,b){return a+b},0);
    let ranking = 0;
    for (key of sortedData){
        if (key[0] != "placeholder"){
            item = document.getElementById(`freq-${key[0]}`);
            item.innerHTML = `${key[0]}: ${Math.round((key[1]/totalSum)*100)}% (${key[1]})`;
            item.style.width = `${(key[1]/maxkeypresses)*90}%`;    
            item.style.top = `${ranking*30}px`;
            ranking += 1;
        }
    }
}

setupKeyboard();
setupFreqBars();
