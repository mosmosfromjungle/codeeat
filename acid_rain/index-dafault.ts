let canvasWidth = 300;
let canvasHeight = 180;
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
    alert("스테이지 : 1 [목표 포인트 : 5]");
    keywords = ['apple', 'banana', 'kiwi', 'tomato', 'coconut', 'mango'];
    goal = 5;
} else if (level === "2") {
    alert("스테이지 : 2 [목표 포인트 : 10]");
    keywords = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'];
    goal = 10;
}

let keywordCnt = 0;
let point = 0; // 포인트
let heart = 5; // 목숨

document.getElementById('point')!.innerHTML = "포인트 : " + point;
document.getElementById('heart')!.innerHTML = "목숨 : " + heart;

function gameWin(): void {
    clearInterval(setInterval1);
    clearInterval(setInterval2);
    if (level === "2") {
        document.body.innerHTML = "<h1>축하드립니다! You are Winner! XD</h1>\
		<h3>made by munsiwoo</h3>";
    } else {
        document.body.innerHTML = "<h1>성공!</h1><br><a href='?level=" + (parseInt(level || "1") + 1) + "'>다음 레벨</a>";
    }
}

function removeNode(pRemoveEle: string): void {
    const vRemove = document.getElementById(pRemoveEle);
    if (vRemove) {
        vRemove.parentNode?.removeChild(vRemove);
    }
}

function gameOver(): void {
    clearInterval(setInterval1);
    clearInterval(setInterval2);
    document.body.innerHTML = "<h1>게임 오버 :(</h1><button onclick='location.reload()'><h3>다시하기</h3></button>";
}

function randomSpeed(maxSpeed: number): number {
    return Math.floor(Math.random() * maxSpeed) + 1;
}

function randomWidth(): number {
    return Math.floor(Math.random() * 300) + 1;
}

class KeywordRain {
    y: number;
    speed: number;
    node: HTMLElement;

    constructor() {
        this.y = 0;
        this.speed = randomSpeed(2);

        this.node = document.createElement('h5');
        this.node.id = keywords[keywordCnt];
        this.node.innerHTML = keywords[keywordCnt++];

        if (keywordCnt >= keywords.length) {
            clearInterval(setInterval1);
        }

        this.node.style.position = 'absolute';
        this.node.style.left = randomWidth().toString() + 'px';

        document.getElementById('canvas')?.appendChild(this.node);
    }

    move(): void {
        if (this.y > canvasHeight) {
            $(this.node).empty();
            this.y = this.speed = 0;
            keywords.splice(keywords.indexOf(this.node.id), 1);
            keywordCnt -= 1;
            heart -= 1;
            document.getElementById('heart')!.innerHTML = "목숨 : " + heart;
            if (heart < 1) gameOver();
            return;
        }
        this.y += this.speed;
        this.node.style.top = this.y + 'px';
    }
}

function keyDown(keyCode: number): void {
    if (keyCode === 13) {
        const text = document.getElementById('text') as HTMLInputElement;

        if (keywords.includes(text.value)) {
            removeNode(text.value);
            for (const item of game) {
                if (item.node.id === text.value) {
                    item.y = 0;
                    item.speed = 0;
                }
            }
            keywords.splice(keywords.indexOf(text.value), 1);
            keywordCnt -= 1;
            point += 1;
            document.getElementById('point')!.innerHTML = "포인트 : " + point;
        }
        text.value = "";
        if (point >= goal) gameWin();
    }
}

const game: KeywordRain[] = [];

const setInterval1 = setInterval(() => {
    game.push(new KeywordRain());
}, 1000);

const setInterval2 = setInterval(() => {
    for (const g of game) {
        g.move();
    }
}, 15);
