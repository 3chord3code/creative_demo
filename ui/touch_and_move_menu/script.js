const BUTTON = document.querySelector('.btn');
const BUTTON_DIAMERTER = BUTTON.offsetWidth;//ボタンの直径
const BUTTON_RADIUS = BUTTON_DIAMERTER / 2;//ボタンの半径


//ボタンの位置をオブジェクトで管理
// xはcssのrightの値
let buttonPosition = {
  right: null,
  top: null
}

const MENU_BG = document.querySelector('.menu-bg');
const MENU_BG_DIAMERTER = MENU_BG.offsetWidth;//メニュー背景エリアの直径
const MENU_BG_RADIUS = MENU_BG.offsetWidth / 2;//メニュー背景エリアの半径

const MENU = document.querySelector('.menu');

//メニューが開いているかどうかの状態
let menuStatusOpen = false;

//メニューボタンの位置記録
let recordButtonPosition = (buttonPosiRight, buttonPosiTop) => {
  let viewportWidth = window.innerWidth;

  let buttonPosi = BUTTON.getBoundingClientRect();
  let right = viewportWidth - buttonPosi.x - BUTTON_DIAMERTER;
  let top = buttonPosi.y;

  buttonPosition = {
    right: `${right}px`,//rightからの距離
    top: `${top}px`
  }
  localStorage.setItem('buttonPosition', JSON.stringify(buttonPosition));
}

//メニューボタンの初期値セット
let setButtonPositionInit = () => {
  if(localStorage.getItem('buttonPosition')) {
    let buttonPosi = JSON.parse(localStorage.getItem('buttonPosition'));
    BUTTON.style.right = buttonPosi.right;
    BUTTON.style.top = buttonPosi.top;
    MENU_BG.style.right = buttonPosi.right;
    MENU_BG.style.top = buttonPosi.top;
  } else {

    let buttonPosiRight = getComputedStyle(BUTTON).getPropertyValue('--right-position');
    let buttonPosiTop = getComputedStyle(BUTTON).getPropertyValue('--top-position');
    
    BUTTON.style.right = buttonPosiRight;
    BUTTON.style.top = buttonPosiTop;
    MENU_BG.style.right = buttonPosiRight;
    MENU_BG.style.top = buttonPosiTop;
  }
}
setButtonPositionInit();


/*
 メニューボタンの移動処理
*/
BUTTON.addEventListener('touchmove', (e)=>{
  e.preventDefault();

  let xPoint = e.touches[0].clientX;
  let yPoint = e.touches[0].clientY;
  moveButton(xPoint, yPoint);
  //ボタン移動中は膨らむ
  BUTTON.classList.add('touched');
})

//メニューボタンのタッチ移動が終わったときの処理
BUTTON.addEventListener('touchend', ()=>{
  BUTTON.classList.remove('touched');
  BUTTON.addEventListener('transitionend', recordButtonPosition);
})

//メニューボタン位置を画面タッチ位置に応じて変える関数
let moveButton = (touchX, touchY) => {
  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;

  let buttonXPosition = viewportWidth - touchX - BUTTON_RADIUS;
  let buttonYPosition = touchY - BUTTON_RADIUS;

  if(touchX > viewportWidth - BUTTON_RADIUS) {//ボタンがviewport右にはみ出さないようにする処理
    buttonXPosition = 0;
  } else if(touchX < BUTTON_RADIUS) {//ボタンがviewport左にはみ出さないようにする処理
    buttonXPosition = viewportWidth - BUTTON_DIAMERTER;
  }
  if(touchY < BUTTON_RADIUS) {//ボタンがviewportの上にはみ出さないようにする処理
    buttonYPosition = 0;
  } else if(touchY > viewportHeight - BUTTON_RADIUS) {//ボタンがviewportの下にはみ出さないようにする処理
    buttonYPosition = viewportHeight - BUTTON_DIAMERTER;
  }

  //タッチ点の移動に合わせてボタンの位置を移動
  BUTTON.style.right = `${buttonXPosition}px`;
  BUTTON.style.top = `${buttonYPosition}px`;

  if(menuStatusOpen === false) {
    MENU_BG.style.right = `${buttonXPosition}px`;
    MENU_BG.style.top = `${buttonYPosition}px`;
  }

  // console.log(getMaxDiagonal());
}


/*
 メニュー展開処理
*/

let showMenu = () => {
  MENU.dataset.menu = 'sp-open';
}
let hideMenu = () => {
  MENU.dataset.menu = 'sp-close';
}

//ボタンを押したときの反応
BUTTON.addEventListener('click', () => {
  if(menuStatusOpen === false) {
    let menu_bg_scale = getMaxDiagonal() / MENU_BG_RADIUS;
    MENU_BG.style.scale = menu_bg_scale;
    menuStatusOpen = true;
    BUTTON.innerHTML = 'CLOSE';
    BUTTON.classList.add('open');

  } else if(menuStatusOpen === true) {
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let buttonOffset = BUTTON.getBoundingClientRect();

    MENU_BG.style.right = `${viewportWidth - buttonOffset.x - BUTTON_DIAMERTER}px`;
    MENU_BG.style.top = `${buttonOffset.y}px`;

    MENU_BG.style.scale = 0;
    menuStatusOpen = false;
    BUTTON.innerHTML = 'MENU';
    BUTTON.classList.remove('open');

  }

  MENU_BG.addEventListener('transitionend', () => {
    if(menuStatusOpen === true) {
      showMenu();
    } 
  })
  MENU_BG.addEventListener('transitionstart', () => {
    if(menuStatusOpen === false) {
      hideMenu();
    } 
  })

})

//対角線のうち最大のものを求める関数
let getMaxDiagonal = () =>  {
  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;

  //ビューポート端との4つの対角線を格納する配列
  let diagonal = [];

  //メニューボタン中心からビューポート端までの長さ
  let buttonOffset = BUTTON.getBoundingClientRect();
  //左上
  let buttonOffsetLtX = buttonOffset.x + BUTTON_RADIUS;
  let buttonOffsetLtY = buttonOffset.y + BUTTON_RADIUS;
  //右上
  let buttonOffsetRtX = viewportWidth - buttonOffset.x + BUTTON_RADIUS;
  let buttonOffsetRtY = buttonOffset.y + BUTTON_RADIUS;
  //右下
  let buttonOffsetRbX = viewportWidth - buttonOffset.x + BUTTON_RADIUS;
  let buttonOffsetRbY = viewportHeight - buttonOffset.y + BUTTON_RADIUS;
  //左下
  let buttonOffsetLbX = buttonOffset.x + BUTTON_RADIUS;
  let buttonOffsetLbY = viewportHeight - buttonOffset.y + BUTTON_RADIUS;

  //ビューポート端との4つの対角線に長さ
  let diagonalLt = Math.sqrt((buttonOffsetLtX ** 2) + (buttonOffsetLtY ** 2));
  let diagonalRt = Math.sqrt((buttonOffsetRtX ** 2) + (buttonOffsetRtY ** 2));
  let diagonalRb = Math.sqrt((buttonOffsetRbX ** 2) + (buttonOffsetRbY ** 2));
  let diagonalLb = Math.sqrt((buttonOffsetLbX ** 2) + (buttonOffsetLbY ** 2));

  diagonal.push(diagonalLt, diagonalRt, diagonalRb, diagonalLb);
  return Math.max(...diagonal);
}




