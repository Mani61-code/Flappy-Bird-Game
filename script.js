let move_speed = 3, gravity = 0.3;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');
let game_state = 'Start';
let bird_dy = 0;

img.style.display = 'none';
message.classList.add('messageStyle');
function endGame() {
    game_state = 'End';
    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
    message.classList.add('messageStyle');
    img.style.display = 'none';
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && game_state !== 'Play') {
      
        document.querySelectorAll('.pipe_sprite').forEach((el) => el.remove());

        bird.style.top = '39vh';
        bird_dy = 0;
        img.style.display = 'block';
        img.src = 'images/Bird.png';
        score_val.innerHTML = '0';
        score_title.innerHTML = 'Score : ';
        message.innerHTML = '';
        message.classList.remove('messageStyle');

        game_state = 'Play';
        play();
    }
    if ((e.key === 'ArrowUp' || e.key === ' ') && game_state === 'Play') {
        bird_dy = -7.0;
        img.src = 'images/Bird.png';
    }
});
document.addEventListener('keyup', (e) => {
    if ((e.key === 'ArrowUp' || e.key === ' ') && game_state === 'Play') {
        img.src = 'images/Bird.png';
    }
});

function play() {
    let pipe_separation = 0;
    const pipe_gap = 32;

    function apply_gravity() {
        if (game_state !== 'Play') return;

        bird_dy += gravity;
        let bird_props = bird.getBoundingClientRect();

        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            endGame();
            return;
        }
        bird.style.top = bird_props.top + bird_dy + 'px';
        requestAnimationFrame(apply_gravity);
    }

    function move_pipes() {
        if (game_state !== 'Play') return;
        let pipes = document.querySelectorAll('.pipe_sprite');
        let bird_props = bird.getBoundingClientRect();
        pipes.forEach((pipe) => {
            let pipe_props = pipe.getBoundingClientRect();

            if (pipe_props.right <= 0) {
                pipe.remove();
            } else {
                if (
                    bird_props.left < pipe_props.left + pipe_props.width &&
                    bird_props.left + bird_props.width > pipe_props.left &&
                    bird_props.top < pipe_props.top + pipe_props.height &&
                    bird_props.top + bird_props.height > pipe_props.top
                ) {
                    endGame();
                    return;
                }
                if (
                    pipe_props.right < bird_props.left &&
                    pipe.increase_score === '1'
                ) {
                    score_val.innerHTML = parseInt(score_val.innerHTML) + 1;
                    pipe.increase_score = '0';
                   
                }
                pipe.style.left = pipe_props.left - move_speed + 'px';
            }
        });

        requestAnimationFrame(move_pipes);
    }

    function create_pipe() {
        if (game_state !== 'Play') return;
        if (pipe_separation > 115) {
            pipe_separation = 0;
            let pipe_pos = Math.floor(Math.random() * 43) + 8;
            const container = document.querySelector('.background');
            let pipe_top = document.createElement('div');
            pipe_top.className = 'pipe_sprite';
            pipe_top.style.top = (pipe_pos - 70) + 'vh';
            pipe_top.style.left = '100vw';
            let pipe_bottom = document.createElement('div');
            pipe_bottom.className = 'pipe_sprite bottom';
            pipe_bottom.style.top = (pipe_pos + pipe_gap) + 'vh';
            pipe_bottom.style.left = '100vw';
            pipe_bottom.increase_score = '1';
            container.appendChild(pipe_top);
            container.appendChild(pipe_bottom);
        }
        pipe_separation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(apply_gravity);
    requestAnimationFrame(move_pipes);
    requestAnimationFrame(create_pipe);
}
