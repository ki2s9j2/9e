const LETTER = `
<div style="text-align:center;margin:8px 0 16px;">
  <span style="font-size:26px;color:#b71c1c;font-family:'Dancing Script',cursive;letter-spacing:1px;text-shadow:0 2px 4px rgba(0,0,0,0.1);line-height:1.2">
    Gửi các bạn nữ thân yêu của lớp 💕
  </span>
  <div style="width:70%;margin:8px auto 0;height:2px;background:linear-gradient(to right,transparent,#b71c1c,transparent);border-radius:2px"></div>
</div>

<div style="background:linear-gradient(145deg,rgba(255,255,255,0.8),rgba(252,228,236,0.6));border-radius:12px;padding:16px 18px;margin-bottom:16px;box-shadow:inset 0 0 10px rgba(255,255,255,0.5), 0 4px 15px rgba(0,0,0,0.05)">
  <p style="font-size:16px;line-height:1.9;color:#4a4a4a;margin:0;font-family:'Comic Neue',cursive;text-align:left;white-space:pre-wrap">
Nhân ngày Quốc tế Phụ nữ 8/3, thay mặt các bạn nam trong lớp, xin gửi đến tất cả các bạn nữ những lời chúc tốt đẹp nhất! 🌸

Cảm ơn các bạn đã luôn mang đến tiếng cười, sự ấm áp và năng lượng tích cực cho lớp mình.
Các bạn chính là những bông hoa đẹp nhất, làm cho lớp học luôn tràn đầy niềm vui.

Chúc các bạn luôn xinh đẹp, tự tin, rạng rỡ và đạt được mọi ước mơ! 
Hãy luôn giữ nụ cười thật tươi nhé! 😊

Yêu thương từ cả lớp 💖
  </p>
</div>`;

window.UNIVERSE_MSGS = [
  "Happy Women's Day",
  "Chúc Mừng 8/3",
  "Gửi các bạn nữ",
  "Luôn xinh đẹp nhé",
  "Lớp mình yêu các bạn",
  "Cười thật nhiều nha 💕"
];

/* ============ LUCKY WHEEL LOGIC ============ */
const classList = [
    { short: "An", full: "Nguyễn Thị An" },
    { short: "Bình", full: "Trần Thanh Bình" },
    { short: "Châu", full: "Lê Ngọc Châu" },
    { short: "Dương", full: "Phạm Ánh Dương" },
    { short: "Hà", full: "Vũ Thu Hà" },
    { short: "Hải", full: "Đặng Thanh Hải" },
    { short: "Khánh", full: "Bùi Ngọc Khánh" },
    { short: "Linh", full: "Hồ Thùy Linh" },
    { short: "Minh", full: "Phan Nguyệt Minh" },
    { short: "Ngọc", full: "Đỗ Bảo Ngọc" },
    { short: "Trang", full: "Ngô Quỳnh Trang" },
    { short: "Tuấn", full: "Đoàn Minh Tuấn" },
    { short: "Vy", full: "Lý Thảo Vy" },
    { short: "Yến", full: "Trương Hải Yến" },
    { short: "My", full: "Phạm Trà My" },
    { short: "Nhi", full: "Trần Yến Nhi" }
];

const wheelCanvas = document.getElementById('wheelCanvas');
const ctx = wheelCanvas ? wheelCanvas.getContext('2d') : null;
const spinBtn = document.getElementById('spinBtn');
const finishBtn = document.getElementById('finishBtn');
let currentRotation = 0;
let isSpinning = false;
let tickTimeoutId;
let autoSpinTimeoutId;

// --- AUDIO LOGIC ---
let audioContext;
let isAudioInitialized = false;

function initAudio() {
    if (isAudioInitialized) return;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    isAudioInitialized = true;
}

function playTick() {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function startTicking(duration) {
    const startTime = Date.now();
    function schedule() {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= duration - 200) { clearTimeout(tickTimeoutId); return; }
        playTick();
        const minDelay = 70;
        const maxDelay = 700;
        const progress = elapsedTime / duration;
        const currentDelay = minDelay + (maxDelay - minDelay) * Math.pow(progress, 2);
        tickTimeoutId = setTimeout(schedule, currentDelay);
    }
    schedule();
}

function playWinSound() {
    if (!audioContext) return;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((note, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(note, audioContext.currentTime + i * 0.1);
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime + i * 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.2);
        oscillator.start(audioContext.currentTime + i * 0.1);
        oscillator.stop(audioContext.currentTime + i * 0.1 + 0.2);
    });
}
// -------------------

function drawWheel() {
    if (!ctx) return;
    const numSegments = classList.length;
    const anglePerSegment = (Math.PI * 2) / numSegments;
    const centerX = wheelCanvas.width / 2;
    const centerY = wheelCanvas.height / 2;
    const radius = centerX;
    
    const colors = ['#fbb4a5', '#ff9999', '#ffcc99', '#ffb6c1', '#ffd700', '#ffcccb', '#f8bbd0', '#ffc0cb', '#facc15', '#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#a78bfa'];

    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);

    for (let i = 0; i < numSegments; i++) {
        const startAngle = i * anglePerSegment;
        const endAngle = startAngle + anglePerSegment;
        
        ctx.beginPath();
        // Inner arc for a nicer border approach
        ctx.arc(0, 0, radius - 10, startAngle, endAngle, false);
        ctx.arc(0, 0, 0, endAngle, startAngle, true);
        
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        
        // Draw Text
        ctx.save();
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px 'Quicksand', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 4;
        
        let text = classList[i].short;
        if (ctx.measureText(text).width > radius * 0.65) {
             text = text.substring(0, 10) + '...';
        }
        ctx.fillText(text, radius * 0.6, 0);
        
        ctx.restore();
    }
    
    // Draw Center Circle
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#d1d5db';
    ctx.fill();
    
    ctx.restore();
}
if(wheelCanvas) drawWheel();

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    
    initAudio();
    startTicking(4000); // Because CSS transition is 4s
    
    // Random spin ending at a specific segment calculated precisely
    const randomSpins = 5 + Math.floor(Math.random() * 5); // 5 to 9 full spins
    const numSegments = classList.length;
    
    // Safety check in case everyone has been spun
    if (numSegments === 0) {
        showCelebration("CHÚC MỪNG 8/3<br>CHÚC CÁC BẠN VUI VẺ!", undefined, true);
        isSpinning = false;
        return;
    }
    
    const degreesPerSegment = 360 / numSegments;
    const winningIndex = Math.floor(Math.random() * numSegments); // Random winner
    
    const segmentCenterDegrees = (winningIndex * degreesPerSegment) + (degreesPerSegment / 2);
    // Pointer is at the top (270 degrees in canvas coords).
    const desiredStopAngle = 270 - segmentCenterDegrees;
    
    currentRotation = Math.ceil(currentRotation / 360) * 360 + randomSpins * 360 + desiredStopAngle;
    
    wheelCanvas.style.transform = `rotate(${currentRotation}deg)`;
    
    setTimeout(() => {
        clearTimeout(tickTimeoutId);
        isSpinning = false;
        
        showCelebration(classList[winningIndex].full, winningIndex);
    }, 4000); // Because CSS transition is 4s now.
}

if(spinBtn) spinBtn.addEventListener('click', spinWheel);

if(finishBtn) {
    finishBtn.addEventListener('click', () => {
        clearTimeout(autoSpinTimeoutId);
        showCelebration("CHÚC MỪNG 8/3<br>CHÚC CÁC BẠN VUI VẺ!", undefined, true);
    });
}

function showCelebration(fullName, indexToRemove, isFinale = false) {
    const phase3 = document.getElementById('phase3');
    const phase4 = document.getElementById('phase4');
    const celebName = document.getElementById('celebrationName');
    
    phase3.classList.remove('show');
    setTimeout(() => {
        phase3.style.display = "none";
        phase4.classList.add('show');
        
        if (isFinale) {
            celebName.innerHTML = fullName;
            createFallingPhotos();
            
            // Show Photo Gallery
            const gallery = document.getElementById('photoGallery');
            if (gallery) {
                const classPhotos = [
                    './image/anh 1.jpg',
                    './image/anh 2.jpg',
                    './image/anh 3.jpg'
                ];
                
                classPhotos.forEach((src, idx) => {
                    const item = document.createElement('div');
                    item.className = 'gallery-item';
                    item.style.setProperty('--rot', (idx === 1 ? '0deg' : (idx === 0 ? '-3deg' : '3deg')));
                    item.innerHTML = `<img src="${src}" alt="Class Photo ${idx + 1}">`;
                    gallery.appendChild(item);
                    
                    // Staggered show animation
                    setTimeout(() => item.classList.add('show'), 500 + idx * 400);
                });
            }
        } else {
            celebName.innerHTML = "Chúc Mừng<br>" + fullName + " !";
        }
        
        celebName.classList.add('pop');
        playWinSound();
        fireConfetti();
        
        // Auto close after 8 seconds
        if (indexToRemove !== undefined && !isFinale) {
            autoSpinTimeoutId = setTimeout(() => {
                // Remove winner so they don't get spun again
                if(indexToRemove > -1) {
                    classList.splice(indexToRemove, 1);
                }
                
                // Hide Celebration and Reset
                phase4.classList.remove('show');
                celebName.classList.remove('pop');
                
                // Clear old confetti if any
                if(typeof confetti === "function") {
                    confetti.reset();
                }
                
                // Return to Spinning Phase
                phase3.style.display = "flex";
                setTimeout(() => {
                    phase3.classList.add('show');
                    drawWheel();
                    if(classList.length === 0) {
                        showCelebration("CHÚC MỪNG 8/3<br>CHÚC CÁC BẠN VUI VẺ!", undefined, true);
                    }
                }, 50);
            }, 8000); // 8 seconds wait
        }
    }, 1000);
}

function fireConfetti() {
    if(typeof confetti !== "function") return;
    var count = 300;
    var defaults = { origin: { y: 0.7 }, zIndex: 1000 };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
}

/* ============ SVG ROSE DRAWING & PHASE 1 ============ */
window.addEventListener('load', () => {
    // Remove not-loaded class if any
    document.body.classList.remove("not-loaded");
    
    // Setup Rose animation
    const leafOne = document.querySelector('.leafOne');
    const stickLine = document.querySelector('.stickLine');
    const leafTwo = document.querySelector('.leafTwo');
    const leafS1 = document.querySelector('.leafS1');
    const rose1 = document.querySelector('.rose1');
    const rose2 = document.querySelector('.rose2');
    const rose3 = document.querySelector('.rose3');
    const rose4 = document.querySelector('.rose4');

    if (leafOne && window.anime) {
        window.anime({
            targets: [leafOne, stickLine, leafTwo, leafS1, rose1, rose2, rose3, rose4],
            strokeDashoffset: [window.anime.setDashoffset, 0],
            easing: 'easeInOutCubic',
            duration: 4000,
            begin: function () {
                [leafOne, leafTwo, stickLine, leafS1, rose1, rose2, rose3, rose4].forEach(el => {
                    el.setAttribute("stroke", "white");
                    el.setAttribute("fill", "none");
                    el.setAttribute("stroke-width", "2");
                });
            },
            complete: function () {
                leafOne.setAttribute("fill", "#9CDD05");
                leafTwo.setAttribute("fill", "#9CDD05");
                stickLine.setAttribute("fill", "#83AA2E");
                leafS1.setAttribute("fill", "#9CDD05");
                rose1.setAttribute("fill", "#F37D79");
                rose2.setAttribute("fill", "#D86666");
                rose3.setAttribute("fill", "#F37D79");
                rose4.setAttribute("fill", "#D86666");
                
                [leafOne, leafTwo, stickLine, leafS1, rose1, rose2, rose3, rose4].forEach(el => {
                    el.setAttribute("stroke", "none");
                });

                const svgContainer = document.getElementById('rose-drawing-container');
                setTimeout(() => {
                    if(svgContainer) {
                        svgContainer.style.transition = 'opacity 1s';
                        svgContainer.style.opacity = '0';
                    }
                    setTimeout(() => {
                        const btn = document.getElementById('continueBtn');
                        const introWrap = document.querySelector('.intro-wrap');
                        if(introWrap) {
                           introWrap.style.opacity = '1';
                           introWrap.style.transform = 'translateY(0)';
                        }
                        if(btn) {
                           btn.style.display = 'inline-block';
                        }
                    }, 1000);
                }, 1000);
            },
            autoplay: true,
        });
    } else {
        // Fallback if elements not found
        const introWrap = document.querySelector('.intro-wrap');
        if(introWrap) {
            introWrap.style.opacity = '1';
            introWrap.style.transform = 'translateY(0)';
        }
    }
});

/* ============ PHASE 1 → 2 ============ */
document.getElementById('continueBtn').addEventListener('click', function(e) {
    e.stopPropagation();
    document.getElementById('phase1').classList.add('out');
    playMusic();
    setTimeout(() => document.getElementById('phase2').classList.add('show'), 800);
});

/* ============ ENVELOPE (gift_letterv2 style) ============ */
let typingStarted = false;
document.getElementById('seal').addEventListener('click', () => {
    const ew = document.getElementById('envWrap');
    ew.classList.toggle('flap');
    if (ew.classList.contains('flap') && !typingStarted) {
        typingStarted = true;
        setTimeout(startTyping, 2000);
    }
});

let isTyping = false;
function startTyping() {
    if (isTyping) return;
    isTyping = true;

    const el = document.getElementById('text');
    const raw = LETTER;
    let i = 0;
    let html = '';
    const CURSOR = '<span class="typing-cursor">|</span>';

    function type() {
        if (i < raw.length) {
            const ch = raw.charAt(i);
            if (ch === '<') {
                // Find end of tag, add entire tag at once
                const tagEnd = raw.indexOf('>', i);
                if (tagEnd !== -1) {
                    html += raw.substring(i, tagEnd + 1);
                    i = tagEnd + 1;
                } else {
                    html += ch;
                    i++;
                }
                setTimeout(type, 0);
            } else {
                html += ch;
                el.innerHTML = html + CURSOR; // Cursor sits right after last typed char
                const letterEl = document.querySelector('.env-letter');
                letterEl.scrollTop = letterEl.scrollHeight;
                i++;
                setTimeout(type, 25);
            }
        } else {
            el.innerHTML = html; // Final render without cursor
            document.body.classList.add('typing-done');
            setTimeout(() => {
                const letterNode = document.querySelector('.env-letter');
                // No expansion - keep letter inside envelope like reference code
                const giftSec = document.getElementById('giftSection');
                if(giftSec){
                    giftSec.style.opacity = '1';
                    giftSec.style.visibility = 'visible';
                }
                letterNode.scrollTop = 0;
            }, 500);
        }
    }
    type();
}

document.getElementById('giftBtn').addEventListener('click', () => {
    // Fade out entire phase 2, then show phase 3
    document.getElementById('phase2').classList.add('fade-out');
    setTimeout(() => {
        document.getElementById('phase2').style.display = 'none';
        const p3 = document.getElementById('phase3');
        p3.classList.remove('hidden');
        p3.style.display = 'flex';
        setTimeout(() => p3.classList.add('show'), 50);
    }, 1000);
});


/* ============ MUSIC ============ */
const bgM = document.getElementById('bgMusic'), mBtn = document.getElementById('musicBtn');
let mP = false;

function playMusic() {
    if (!mP) {
        bgM.volume = .35;
        let playPromise = bgM.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                mP = true;
                mBtn.textContent = '🎵';
                mBtn.classList.add('playing');
            }).catch(error => {
                console.log("Audio play failed, user interaction may be required or source is broken:", error);
            });
        }
    }
}
mBtn.addEventListener('click', () => { if (mP) { bgM.pause(); mP = false; mBtn.textContent = '🔇'; mBtn.classList.remove('playing') } else playMusic() });

// End of script

/* ================== FALLING PHOTOS ================== */
function createFallingPhotos() {
    const container = document.getElementById('falling-photos-container');
    if (!container) return;
    container.style.display = 'block';
    
    // Use the varied images found in the gift folder
    const photos = [
        './image/giftbox.png',
        './image/handsCat.png',
        './image/heartAnimation.gif',
        './image/mewmew.gif',
        './image/letters.png',
        './image/anh 1.jpg',
        './image/anh 2.jpg',
        './image/anh 3.jpg'
    ];

    // Spawn a new photo every 400ms
    setInterval(() => {
        const img = document.createElement('img');
        img.src = photos[Math.floor(Math.random() * photos.length)];
        img.className = 'falling-photo';
        
        // Randomize initial position, size, and rotation
        const startX = Math.random() * 90; // 0 to 90vw
        const size = Math.random() * 8 + 6; // 6rem to 14rem
        const rotation = (Math.random() * 90) - 45; // -45deg to 45deg
        const duration = Math.random() * 4 + 5; // 5s to 9s fall duration

        img.style.left = startX + 'vw';
        img.style.width = size + 'rem';
        img.style.height = 'auto'; // Keep aspect ratio
        img.style.setProperty('--target-rotation', rotation + 'deg');
        img.style.animationDuration = duration + 's';

        container.appendChild(img);

        // Remove photo from DOM after animation completes
        setTimeout(() => {
            if(img && img.parentNode) {
                img.remove();
            }
        }, duration * 1000 + 500);
    }, 450);
}
