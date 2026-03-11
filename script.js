const board = document.querySelector(".board");
const startBtn = document.querySelector(".btn-start")
const restartBtn = document.querySelector(".btn-restart")
const modal = document.querySelector(".modal")
const startGameModal = document.querySelector(".start-game")
const gameTypeModal = document.querySelector(".game-type")
const overGameModal = document.querySelector(".game-over")


const easyBtn = document.querySelector(".btn-easy")
const mediumBtn = document.querySelector(".btn-medium")
const hardBtn = document.querySelector(".btn-hard")

let speed = 200;


const highScoreElement = document.querySelector("#high-score")
const scoreElement = document.querySelector("#score")
const timeElement = document.querySelector("#time")

const blockWidth = 30;
const blockheight = 30;

const cols =Math.floor(board.clientWidth / blockWidth);
const rows =Math.floor(board.clientHeight / blockWidth);


let food = {x:Math.floor(Math.random() * rows) , y:Math.floor(Math.random() * cols)};


let blocks = []
let snake = [{ x:7, y:3 }, { x:7, y:4 }, { x:7, y:5 } ]


let highScore = localStorage.getItem("highscore") || 0;
let score = 0;
let time = `00-00`;

highScoreElement.innerText = highScore;



let direction = "up"
let intervalTime = null;
let timeIntervalTime = null;



// board may blocks

for(let row = 0 ;row < rows;row++){
    for(let col = 0 ; col < cols ;col++){
        let block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);

        // array of blocks
        blocks[`${row}-${col}`] = block;
    }
}


function render(){

    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add("food")

    // directions

    if(direction ==="left"){
         head = {x:snake[0].x , y:snake[0].y - 1}
    }else if(direction === "right"){
        head = {x:snake[0].x , y:snake[0].y + 1}
    }else if(direction === "down"){
        head = {x:snake[0].x + 1 , y:snake[0].y}
    }else if(direction === "up"){
        head = {x:snake[0].x - 1 , y:snake[0].y}
    }
    


    // wall end logic
    if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >=cols){
        clearInterval(intervalTime);

        modal.style.display = "flex"
        startGameModal.style.display = "none";
        overGameModal.style.display = "flex"
        return;
    }


    // food consume logic
    if(head.x == food.x && head.y == food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food")
        food = {x:Math.floor(Math.random() * rows) , y:Math.floor(Math.random() * cols)};
        blocks[`${food.x}-${food.y}`].classList.add("food")
        snake.unshift(head)

        // score
        score += 10;
        scoreElement.innerText = score

        if(score > highScore){
            highScore = score;
            localStorage.setItem("highscore",highScore.toString())
            highScore = localStorage.getItem("highscore")
        }
    }

    
    snake.forEach((segment)=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    })
    
    snake.unshift(head)
    snake.pop()



    snake.forEach((segment)=>{
        blocks[`${segment.x}-${segment.y}`].classList.add("fill")
    })
}



startBtn.addEventListener("click",()=>{
    startGameModal.style.display = "none"
    gameTypeModal.style.display = "flex"
})


function startGame(){
    modal.style.display = "none"
    gameTypeModal.style.display = "none"
    
    intervalTime = setInterval(() => { render() }, speed);


    timeIntervalTime = setInterval(() => {
        
        let [min,sec] = time.split("-").map(Number);
        
        if(sec>59){
            min+=1;
            sec=0;
        }else{
            sec+=1
        }
        
        time = `${min}-${sec}`;
        
        timeElement.innerText = time
        
    }, 1000);
}


easyBtn.addEventListener("click",()=>{
    speed = 250;
    startGame();
})

mediumBtn.addEventListener("click",()=>{
    speed = 150;
    startGame();
})

hardBtn.addEventListener("click",()=>{
    speed = 80;
    startGame();
})

function restartGame(){

    blocks[`${food.x}-${food.y}`].classList.remove("food")

    snake.forEach((segment)=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    })

    clearInterval(intervalTime)
    clearInterval(timeIntervalTime)

    score = 0;
    time = `00-00`

    scoreElement.innerText = score;
    timeElement.innerText = time;
    highScoreElement.innerText = highScore;

    snake = [
        { x:7, y:3},
        { x:7, y:4},
        { x:7, y:5 }
    ]

    food = {x:Math.floor(Math.random() * rows) , y:Math.floor(Math.random() * cols)};

    modal.style.display = "flex"
    overGameModal.style.display = "none"
    gameTypeModal.style.display = "flex"
}

restartBtn.addEventListener("click",restartGame)


addEventListener("keydown",(event)=>{
    if(event.key === "ArrowRight"){
        direction = "right"
    }else if(event.key === "ArrowLeft"){
        direction = "left"
    }else if(event.key === "ArrowUp"){
        direction = "up"
    }else if(event.key === "ArrowDown"){
        direction = "down"
    }
})



let startX = 0;
let startY = 0;


board.addEventListener("touchstart",(e)=>{
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
})

board.addEventListener("touchend",(e)=>{
    
    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;

    let diffX = endX - startX;
    let diffY = endY - startY;

    if(Math.abs(diffX) > Math.abs(diffY)){
        if(diffX > 0){
            direction = "right"
        }else{
            direction = "left"
        }
    }else{
        if(diffY > 0){
            direction = "down"
        }else{
            direction = "up"
        }
    }

})