(() => {
let mainWrap = document.getElementById('main-wrap');
let blocks = document.getElementsByClassName('media-wrap');
// let screenW = window.screen.width,
//     screenH = window.screen.height;
let sliderW = 3800; // high horizontal border
let leftOffset = 1000; // low horizontal border
let screenW = window.innerWidth,
    screenH = window.innerHeight;

const maxSpeed = 3;

// parallax coefficients
let coef = [];
for (let i = 0; i < blocks.length; i++) {
    // coef.push(1 + (Math.random()/5)); // random
    coef.push(blocks[i].getAttribute("slide-coef")); // static from html
}

let lengths = [];
for (let i = 0; i < blocks.length; i++) {
    lengths.push([leftOffset*coef[i], sliderW*coef[i]]); // higher speed - longer way (save same positioning after loop for blocks)
}

if (is_touch_device()) {
    let prevTouch;
    window.addEventListener("touchstart", es => {
        prevTouch = es.touches[0].clientX;
    });
    window.addEventListener("touchmove", e => {
        shiftX = e.touches[0].clientX - prevTouch; // slide of x axis to finger            
        moveAll(shiftX);
        prevTouch = e.touches[0].clientX;
    });
    window.addEventListener("touchend", en => {
        let t = setInterval(() => {
            moveAll(shiftX);
            // slide on finger release
            shiftX*=0.9;
            if (Math.abs(shiftX) < 1) {
                clearInterval(t);
            }
        }, 16);
    });
} else {
    let shiftX, shiftY;
    let m_pos_x = screenW/2 + 400, 
        m_pos_y = screenH/2;
    // get mouse pos when mouse is over the screen
    window.onmousemove = function(e) { m_pos_x = e.clientX; m_pos_y = e.clientY; }
    window.onresize = function() {
        screenW = window.innerWidth;
    };
    // interval that get mouse position and move elements
    setInterval(() => {
        shiftX = (m_pos_x - screenW/2) * -0.005; // coefficient of slide of x axis
        shiftX = fn(shiftX);
        shiftX = (shiftX < -maxSpeed ? -maxSpeed : (shiftX > maxSpeed ? maxSpeed : shiftX));
        shiftY = (m_pos_y - screenH/2) * -0.3; // max depth of y axis
        moveAll(shiftX, shiftY);
    }, 16);
}

// move all elements
function moveAll(x, y) {
    let x_orig = x;
    for (let i = 0; i < blocks.length; i++) {
        x = x_orig;
        blockLeft = Number(blocks[i].style.left.slice(0,-2));
        if (blockLeft < -lengths[i][0]) {
            blocks[i].style.left = lengths[i][1]+"px";
        } else if (blockLeft > lengths[i][1]) {
            blocks[i].style.left = "-"+lengths[i][0]+"px";
        } else {
            x *= coef[i] /*parallax effect*/
            blocks[i].style.left = blockLeft + x + "px";
        }
    }
    if (y) {
        mainWrap.style.transform = "translateY("+y+"px)";
    }
}

function fn(x) {
    let fn = Math.pow(x, 4)/50;
    // let fn = Math.exp(Math.abs(x))/6;
    return x < 0 ? -fn : x == 0 ? 0 : fn;
}

/* 
---------------- описание физики -----------------
1) страница - в пикселях - sliderW
2) страница автоматически прокручивается по последней позиции
3) эффект параллакса создается за счет коэффициента по индексу элемента
4) главное кольцо: 
    - mousemove
    - сохранение последней позиции указателя
    - передвижение элементов с учетом коэффициентов или рандомные
...
*/

function is_touch_device() {  
    try {  
      document.createEvent("TouchEvent");  
      return true;  
    } catch (e) {  
      return false;  
    }  
}
})();