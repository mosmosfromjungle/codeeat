let canvasWidth = 500; // 키워드 생성되는 가로범위
let canvasHeight = 380; // 키워드 생성되는 세로범위
let goal: number, keywords: string[] = [];

function getQuerystring(paramName: string): string | undefined {
    const _tempUrl = window.location.search.substring(1);
    const _tempArray = _tempUrl.split('&');

    for (let i = 0; i < _tempArray.length; i++) {
        const _keyValuePair = _tempArray[i].split('=');
        if (_keyValuePair[0] === paramName) {
            return _keyValuePair[1];
        }
    }
}

let level: string | undefined;

try { 
    level = getQuerystring("level"); 
} catch (exception) { 
    location.href = '?level=1'; 
}

if (level === "1") {
    alert("스테이지 : 1 [목표 포인트 : 500]");
    keywords = ['apple', 'banana', 'kiwi', 'tomato', 'coconut', 'mango'];
    goal = 500;
} else if (level === "2") {
    alert("스테이지 : 2 [목표 포인트 : 1000]");
    keywords = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'];
    goal = 1000;
}

function heartCounter(heart: number): string {
    let result = "<font color=red>";
    for (let x = 0; x < heart; ++x) {
        result += "♥";
    }
    result += "</font>";
    return result;
}

let keywordCnt = 0;
let point = 0; // 포인트
let heart = 5; // 목숨

document.getElementById('point')!.innerHTML = "포인트 : " + point;
document.getElementById('heart')!.innerHTML = "목숨 : " + heartCounter(heart);

function gameWin(): void {
    clearInterval(setInterval1);
    clearInterval(setInterval2);
    if (level === "2") {
        document.body.innerHTML = "<h1>축하드립니다! You are Winner! XD</h1>\
        <h3>made by munsiwoo<br>";
    } else {
        const nextLevel = (parseInt(level || "1") + 1);
        const message = `<h1>${nextLevel - 1}단계 성공!</h1><br><a href='?level=${nextLevel}'>다음 스테이지</a>`;
        document.body.innerHTML = message;
    }
}

function removeNode(pRemoveEle: string): void {
    const vRemove = document.getElementById(pRemoveEle);
    vRemove?.parentNode?.removeChild(vRemove);
}

function gameOver(code: number): void {
    clearInterval(setInterval1);
    clearInterval(setInterval2);
    const message = code === 1 ? "<h1>게임 오버 :(</h1><b>목숨을 모두 잃었습니다.</b><hr>" : "<h1>게임 오버 :(</h1><b>목표 포인트를 채우지 못했습니다.</b><hr>";
    document.body.innerHTML = message + "<button onclick='location.reload()'><h3>다시하기</h3></button>";
}

function randomSpeed(maxSpeed: number): number {
    return Math.floor(Math.random() * maxSpeed) + 1;
}

function randomWidth(): number {
    return Math.floor(Math.random() * canvasWidth) + 50;
}

class KeywordRain {
    y: number;
    speed: number;
    node: HTMLHeadingElement;

    constructor() {
        this.y = 0;
        this.speed = randomSpeed(2);

        this.node = document.createElement('h3');
        this.node.id = keywords[keywordCnt];
        this.node.innerHTML = keywords[keywordCnt++];

        if (keywordCnt >= keywords.length) {
            clearInterval(setInterval1);
        }

        this.node.style.position = 'absolute';
        this.node.style.left = randomWidth().toString();

        document.getElementById('canvas')?.appendChild(this.node);
    }

    move(): void {
        if (this.y > canvasHeight) {
            $(this.node).empty();
            this.y = 0;
            this.speed = 0;
            keywords.splice(keywords.indexOf(this.node.id), 1);
            keywordCnt -= 1;
            heart -= 1;
            document.getElementById('heart')!.innerHTML = "목숨 : " + heartCounter(heart);
            if (heart < 1) gameOver(1);
            if (keywords.length === 0) gameOver(2);
            return;
        }
        this.y += this.speed;
        this.node.style.top = this.y + 'px';
    }
}

function keydown(keyCode: number): void {
    if (keyCode === 13) {
        const text = document.getElementById('text') as HTMLInputElement;

        if (keywords.indexOf(text.value) !== -1) {
            removeNode(text.value);
            point += 100;
            document.getElementById('point')!.innerHTML = "포인트 : " + point;
        }
        text.value = "";
        if (point >= goal) { gameWin(); return; }
        if (keywords.length === 0) { gameOver(2); return; }
    }
}

const game: KeywordRain[] = [];

const setInterval1 = setInterval(() => {
    game.push(new KeywordRain());
}, 1000);

const setInterval2 = setInterval(() => {
    for (const g of game) { g.move(); }
}, 15);
