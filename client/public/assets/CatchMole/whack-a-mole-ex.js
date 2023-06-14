// 0. Bling the Text

flag = 0

function bling() {
  if (flag === 0) {
    document.querySelector('h1').style.color = '#d6806e';
    flag ++;

  } else if (flag === 1) {
    document.querySelector('h1').style.color = '#fbb666';
    flag ++;

  } else if (flag === 2) {
    document.querySelector('h1').style.color = '#f9f871';
    flag ++;

  } else {
    document.querySelector('h1').style.color = '#f2ecff';
    flag = 0;
  }
}

setInterval(bling, 1000);

// 1. Start Button Event

var before = "Catch a Mole! <br/> => 키보드를 이용하여 정답을 말하고 있는 두더지를 잡아줘!";
document.getElementById('problem-box').innerHTML = before;

var startBtn = document.querySelector('.start-btn');
startBtn.addEventListener('click', startMole);

function startMole() {
  startBtn.removeEventListener('click', startMole);
  startBtn.style.color = '#3d3f43';
  getPoint = 0;
  turn = 0;
  setTimeout(showingMole, 1000);
}

// 2. Show Event

var after = [
  ['Q01. 파이썬에서 리스트에 들어있는 모든 수를 합하는 함수는?', ['sum()', 'len()', 'map()', 'list()']],
  ['Q02. 파이썬에서 리스트의 개수를 구하는 함수는?', ['len()', 'abs()', 'map()', 'list()']],
  ['Q03. 파이썬에서 새로운 정렬된 리스트를 반환하는 함수는?', ['sorted()', 'len()', 'map()', 'list()']],
  ['Q04. 파이썬에서 리스트 자체를 정렬시켜버리는 것은?', ['sort()', 'len()', 'map()', 'list()']],
  ['Q05. 파이썬에서 내림차순 정렬을 위해 사용하는 옵션은?', ['reverse()', 'len()', 'map()', 'list()']],
  ['Q06. 파이썬에서 숫자의 절댓값을 리턴하는 함수는?', ['abs()', 'len()', 'map()', 'list()']],
  ['Q07. 파이썬에서 문자열로 구성된 표현식을 입력으로 받아 해당 문자열을 실행한 결괏값을 리턴하는 함수는?', ['eval()', 'len()', 'map()', 'list()']],
  ['Q08. 파이썬에서 문자의 유니코드 숫자 값을 리턴하는 함수는?', ['ord()', 'len()', 'map()', 'list()']],
  ['Q09. 파이썬에서 유니코드 숫자값을 입력받아 그 코드에 해당하는 문자를 리턴하는 함수는?', ['char()', 'len()', 'map()', 'list()']],
  ['Q10. 파이썬에서 for문과 함께 자주 사용하는 함수로, 입력받은 숫자에 해당하는 범위 값을 반복 가능한 객체로 만들어 리턴하는 함수는?', ['range()', 'len()', 'map()', 'list()']]  
];

var moleNumber;
var randomNum;
var preNum;

function randomHole() {
  randomNum = Math.floor(Math.random() * 10);
  
  if (preNum !== randomNum && randomNum > 0) {
    preNum = randomNum; 
    return randomNum;
  }

  return randomHole();
 }

function moleActive(num) {
  num.classList.add('active');
  document.querySelector('#answer-div-'+num.id).classList.remove('hiding');
}

function moleHide(num){
  num.classList.remove('active');
  document.querySelector('#answer-div-'+num.id).classList.add('hiding');
}

var moleCatch = 0;

function showingMole() {
  if (turn < 10) {
    moleNumber = document.getElementById(`${randomHole()}`);

    document.getElementById('problem-box').innerHTML = after[turn][0];
    document.getElementById('answer-text-'+moleNumber.id).innerHTML = after[turn][1][0];

    moleActive(moleNumber);

    moleNumber.addEventListener('click', catchMole);
    moleCatch = setTimeout(seeMole, 1000);
    turn++;

  } else {
    modalEvent();
    startBtn.addEventListener('click', startMole);
    startBtn.textContent = 'PRESS AGAIN';
    startBtn.style.color = '#f2ecff';
  }
}

// 3. Catch Mole Event

var cntBox = document.querySelector('#count-mole');

function seeMole() {
  moleNumber.removeEventListener('click', catchMole);
  moleHide(moleNumber);
  clearTimeout(moleCatch);
  setTimeout(showingMole, 1000);
}

function catchMole() {
  seeMole();
  clearTimeout(moleCatch);
  getPoint++;
  cntBox.innerHTML = getPoint;
}

// 4. Score Modal

var endingBtn = document.querySelector('#ending-bg');
var finalEnding = "finalEnding";

endingBtn.addEventListener('click', hideModal); 

function modalEvent() {
  let point = (getPoint / 10) * 100;

  if (point <= 70) {
    ending.children[0].innerHTML = "<span>GAME OVER </span></br>YOUR SCORE IS&nbsp;&nbsp;<span class='last'>" + point + '</span>!';
  
  } else {
    ending.children[0].innerHTML = "<span>YOU WIN</span></br>YOUR SCORE IS&nbsp;&nbsp;<span class='last'>" + point + '</span>!';
  }

  ending.classList.add(finalEnding);
  endingBtn.classList.add(finalEnding);
}

function hideModal() {
  ending.classList.remove(finalEnding);
  endingBtn.classList.remove(finalEnding);
}