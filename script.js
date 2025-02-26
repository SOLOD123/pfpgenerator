// Проверяем доступность Telegram WebApp API
if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
}

// Инициализация
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let img = new Image();
let overlayImg = new Image();
let overlayX = 0;
let overlayY = 0;
let overlayScale = 1;

// Устанавливаем адаптивный размер канваса
function resizeCanvas() {
    canvas.width = document.querySelector('.generator-container').clientWidth - 20;
    canvas.height = canvas.width;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Функция загрузки основного изображения
function loadImage(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        img.src = event.target.result;
        img.onload = function() {
            drawCanvas();
        };
    };
    reader.readAsDataURL(file);
}

// Функция загрузки накладки
function loadOverlay(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        overlayImg.src = event.target.result;
        overlayImg.onload = function() {
            drawCanvas();
        };
    };
    reader.readAsDataURL(file);
}

// Функция отрисовки
function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(overlayImg, overlayX, overlayY, overlayImg.width * overlayScale, overlayImg.height * overlayScale);
}

// Обработчик загрузки изображения
document.getElementById('upload').addEventListener('change', function(e) {
    loadImage(e.target.files[0]);
});

// Кнопка "Генерировать"
document.getElementById('generate').addEventListener('click', function() {
    const overlayImages = [
        'https://yourserver.com/overlay1.png',
        'https://yourserver.com/overlay2.png',
        'https://yourserver.com/overlay3.png'
    ];
    const randomOverlay = overlayImages[Math.floor(Math.random() * overlayImages.length)];
    
    overlayImg.src = randomOverlay;
    overlayImg.onload = function() {
        drawCanvas();
    };
});

// Кнопка "Скачать"
document.getElementById('download').addEventListener('click', function() {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'pfp.png';
    link.click();
});

// Перемещение накладки (мышь + тач-события)
let isDragging = false;
let startX = 0;
let startY = 0;

function startDrag(x, y) {
    if (x >= overlayX && x <= overlayX + overlayImg.width * overlayScale &&
        y >= overlayY && y <= overlayY + overlayImg.height * overlayScale) {
        isDragging = true;
        startX = x - overlayX;
        startY = y - overlayY;
    }
}

function moveDrag(x, y) {
    if (isDragging) {
        requestAnimationFrame(function() {
            overlayX = x - startX;
            overlayY = y - startY;
            drawCanvas();
        });
    }
}

function stopDrag() {
    isDragging = false;
}

// Обработчики мыши
canvas.addEventListener('mousedown', (e) => startDrag(e.offsetX, e.offsetY));
canvas.addEventListener('mousemove', (e) => moveDrag(e.offsetX, e.offsetY));
canvas.addEventListener('mouseup', stopDrag);
canvas.addEventListener('mouseleave', stopDrag);

// Обработчики тач-событий
canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    startDrag(touch.clientX - rect.left, touch.clientY - rect.top);
});
canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    moveDrag(touch.clientX - rect.left, touch.clientY - rect.top);
});
canvas.addEventListener('touchend', stopDrag);

// Масштабирование накладки
canvas.addEventListener('wheel', function(e) {
    e.preventDefault();
    overlayScale *= e.deltaY > 0 ? 0.9 : 1.1;
    drawCanvas();
});
