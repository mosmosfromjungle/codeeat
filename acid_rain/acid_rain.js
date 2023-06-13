var canvasWidth = 500; // 키워드 생성되는 가로범위
var canvasHeight = 380; // 키워드 생성되는 세로범위
var goal, keywords = [];
function getQuerystring(paramName) {
    var _tempUrl = window.location.search.substring(1);
    var _tempArray = _tempUrl.split('&');
    for (var i = 0; i < _tempArray.length; i++) {
        var _keyValuePair = _tempArray[i].split('=');
        if (_keyValuePair[0] === paramName) {
            return _keyValuePair[1];
        }
    }
}
var level;
try {
    level = getQuerystring("level");
}
catch (exception) {
    location.href = '?level=1';
}
if (level === "1") {
    alert("스테이지 : 1 [목표 포인트 : 500]");
    keywords = ['apple', 'banana', 'kiwi', 'tomato', 'coconut', 'mango'];
    goal = 500;
}
else if (level === "2") {
    alert("스테이지 : 2 [목표 포인트 : 1000]");
    keywords = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'];
    goal = 1000;
}
function heartCounter(heart) {
    var result = "<font color=red>";
    for (var x = 0; x < heart; ++x) {
        result += "♥";
    }
    result += "</font>";
    return result;
}
var keywordCnt = 0;
var point = 0; // 포인트
var heart = 5; // 목숨
document.getElementById('point').innerHTML = "포인트 : " + point;
document.getElementById('heart').innerHTML = "목숨 : " + heartCounter(heart);
function gameWin() {
    clearInterval(setInterval1);
    clearInterval(setInterval2);
    if (level === "2") {
        document.body.innerHTML = "<h1>축하드립니다! You are Winner! XD</h1>\
        <h3>made by munsiwoo<br>";
    }
    else {
        var nextLevel = (parseInt(level || "1") + 1);
        var message = "<h1>".concat(nextLevel - 1, "\uB2E8\uACC4 \uC131\uACF5!</h1><br><a href='?level=").concat(nextLevel, "'>\uB2E4\uC74C \uC2A4\uD14C\uC774\uC9C0</a>");
        document.body.innerHTML = message;
    }
}
function removeNode(pRemoveEle) {
    var _a;
    var vRemove = document.getElementById(pRemoveEle);
    (_a = vRemove === null || vRemove === void 0 ? void 0 : vRemove.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(vRemove);
}
function gameOver(code) {
    clearInterval(setInterval1);
    clearInterval(setInterval2);
    var message = code === 1 ? "<h1>게임 오버 :(</h1><b>목숨을 모두 잃었습니다.</b><hr>" : "<h1>게임 오버 :(</h1><b>목표 포인트를 채우지 못했습니다.</b><hr>";
    document.body.innerHTML = message + "<button onclick='location.reload()'><h3>다시하기</h3></button>";
}
function randomSpeed(maxSpeed) {
    return Math.floor(Math.random() * maxSpeed) + 1;
}
function randomWidth() {
    return Math.floor(Math.random() * canvasWidth) + 50;
}
var KeywordRain = /** @class */ (function () {
    function KeywordRain() {
        var _a;
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
        (_a = document.getElementById('canvas')) === null || _a === void 0 ? void 0 : _a.appendChild(this.node);
    }
    KeywordRain.prototype.move = function () {
        if (this.y > canvasHeight) {
            $(this.node).empty();
            this.y = 0;
            this.speed = 0;
            keywords.splice(keywords.indexOf(this.node.id), 1);
            keywordCnt -= 1;
            heart -= 1;
            document.getElementById('heart').innerHTML = "목숨 : " + heartCounter(heart);
            if (heart < 1)
                gameOver(1);
            if (keywords.length === 0)
                gameOver(2);
            return;
        }
        this.y += this.speed;
        this.node.style.top = this.y + 'px';
    };
    return KeywordRain;
}());
function keydown(keyCode) {
    if (keyCode === 13) {
        var text = document.getElementById('text');
        if (keywords.indexOf(text.value) !== -1) {
            removeNode(text.value);
            point += 100;
            document.getElementById('point').innerHTML = "포인트 : " + point;
        }
        text.value = "";
        if (point >= goal) {
            gameWin();
            return;
        }
        if (keywords.length === 0) {
            gameOver(2);
            return;
        }
    }
}
var game = [];
var setInterval1 = setInterval(function () {
    game.push(new KeywordRain());
}, 1000);
var setInterval2 = setInterval(function () {
    for (var _i = 0, game_1 = game; _i < game_1.length; _i++) {
        var g = game_1[_i];
        g.move();
    }
}, 15);
