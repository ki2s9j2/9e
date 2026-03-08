const TEMPLATES = {
    'all': {
        title: 'Gửi một nửa thế giới xinh đẹp,',
        msg: `Nhân ngày <strong style="color:#d81b60;font-size:17px">Quốc tế Phụ nữ 8/3</strong>, xin gửi vạn lời chúc đến từ bà, người mẹ tảo tần, những cô giáo đáng kính, các chị em gái, những người bạn đồng hành... và cả người thương trân quý. 💕<br><br>Cảm ơn tất cả vì sự dịu dàng, hy sinh và tình yêu thương vô tận đã sưởi ấm thế gian này. Kính chúc một nửa thế giới luôn rạng rỡ, bình an, hạnh phúc và tỏa sáng kiêu hãnh như những vì sao trên bầu trời! ✨`,
        ending: '',
        quote: 'Hạnh phúc không phải là điểm đến, mà là hành trình chúng ta đang đi.',
        universe: "Happy Women's Day, Vạn điều tốt lành, Tỏa sáng rạng rỡ"
    },
    'mom': {
        title: 'Gửi Mẹ kính yêu,',
        msg: `Ngàn lời chúc tụng bay xa,\nChẳng bằng một lát ở nhà bềnh bồng.\nNụ cười rạng rỡ của mẹ,\nCả đời ấm áp chở che đàn con.`,
        ending: 'Ký tên: Người con Tùy Bút',
        quote: 'Mẹ là biển cả bao la, là bầu trời cao rộng sưởi ấm tâm hồn con.',
        universe: 'Con yêu Mẹ nhiều, Cảm ơn Mẹ yêu, Mãi mạnh khỏe Mẹ nhé'
    },
    'teacher': {
        title: 'Lời Yêu Gửi Cô',
        msg: `Bao năm vất vả vì người,\nNay ngày tám tháng ba tuyệt vời tri ân.\nChúc cô khoẻ mạnh bình an,\nĐể dìu dắt tiếp muôn vàn đàn em.`,
        ending: 'Ký tên: Học trò nhỏ',
        quote: 'Người thầy cầm tay, mở ra trí óc và chạm đến trái tim.',
        universe: 'Tri ân Cô giáo, Chúc mừng 8/3, Luôn tươi trẻ hạnh phúc'
    },
    'friend': {
        title: 'Gửi Nhỏ Bạn Thân',
        msg: `Chúc mày mùng tám tháng ba,\nXinh tươi rạng rỡ như hoa trên cành.\nLuôn vui khỏe, bớt đành hanh,\nSớm tìm được mối dỗ dành sớm hôm!`,
        ending: 'Từ đứa bạn thân duy nhất',
        quote: 'Bạn thân là những người hiểu được quá khứ, tin vào tương lai và chấp nhận ta của hiện tại.',
        universe: 'Mãi là bạn tốt, Bớt đành hanh nhé, 8/3 rực rỡ'
    },
    'lover': {
        title: 'Chỉ Dành Cho Em',
        msg: `Thế giới rộng đủ để ta lạc nhau,\nNhưng nụ cười em làm anh phải quay bước.\nChúc em ngày Tám tháng Ba kiêu hãnh,\nVà một đời trọn vẹn ở bên anh.`,
        ending: 'Yêu em, Chàng ngốc của em',
        quote: 'Gặp gỡ là duyên, ở lại là tình, và nắm tay nhau đi hết cuộc đời là nợ.',
        universe: 'Yêu em mãi mãi, Công chúa của anh, Hạnh phúc bên nhau'
    }
};

/* --- PARSE URL PARAMS --- */
const urlParams = new URLSearchParams(window.location.search);
let pageTitle = "Happy Women's Day! 💖";
let letterTitle = TEMPLATES['all'].title;
let letterMsg = TEMPLATES['all'].msg;
let letterEnding = TEMPLATES['all'].ending;
let letterQuote = "Sự tồn tại của bạn vốn dĩ đã là một tuyệt tác của thương đế. Hãy cứ mỉm cười thật rạng rỡ và hạnh phúc mỗi ngày!";
let letterUniverse = "Happy Women's Day, Yêu bạn nhiều ❤️, 8/3 💕";
let paperStyle = 'pink';

const hashLocation = window.location.hash;

if (hashLocation.startsWith('#/share/')) {
    try {
        const base64Data = hashLocation.replace('#/share/', '');
        let decodedStr = '';

        try {
            // Try decompression first (new compressed format)
            if (typeof LZString !== 'undefined') {
                const decompressed = LZString.decompressFromEncodedURIComponent(base64Data);
                if (decompressed) decodedStr = decompressed;
            }
        } catch (e) { console.warn("LZ Decompression failed", e); }

        // Fallback to old base64 parsing if decompression fails
        if (!decodedStr) {
            try {
                decodedStr = decodeURIComponent(escape(atob(base64Data)));
            } catch (e) { console.warn("Base64 decoding failed", e); }
        }

        if (!decodedStr) throw new Error("No decodable data found");

        const shareData = JSON.parse(decodedStr);
        console.log("Parsed shareData:", shareData);

        // Load base from template
        if (shareData.tmp && TEMPLATES[shareData.tmp]) {
            const tmp = TEMPLATES[shareData.tmp];
            letterTitle = tmp.title;
            letterMsg = tmp.msg;
            letterEnding = tmp.ending || '';
            if (tmp.quote) letterQuote = tmp.quote;
            if (tmp.universe) letterUniverse = tmp.universe;
        }

        // Apply overrides if exist
        if (shareData.t) letterTitle = shareData.t;
        if (shareData.m) letterMsg = shareData.m;
        if (shareData.e) letterEnding = shareData.e;
        if (shareData.q) letterQuote = shareData.q;
        if (shareData.u) letterUniverse = shareData.u;

        if (shareData.p) paperStyle = shareData.p;

    } catch (e) {
        console.error("Failed to parse short share data.", e);
    }
} else if (urlParams.has('t') || urlParams.has('m')) {
    try {
        if (urlParams.has('t')) letterTitle = decodeURIComponent(escape(atob(urlParams.get('t'))));
        if (urlParams.has('m')) letterMsg = decodeURIComponent(escape(atob(urlParams.get('m')))).replace(/\n/g, '<br>');
        if (urlParams.has('e')) letterEnding = decodeURIComponent(escape(atob(urlParams.get('e'))));
        if (urlParams.has('p')) paperStyle = urlParams.get('p');
    } catch (e) {
        console.error("Failed to parse custom text.");
    }
} else if (urlParams.has('tmp') && TEMPLATES[urlParams.get('tmp')]) {
    const tmp = TEMPLATES[urlParams.get('tmp')];
    letterTitle = tmp.title;
    letterMsg = tmp.msg;
    letterEnding = tmp.ending || '';
}

let paperBg = 'linear-gradient(145deg,rgba(255,255,255,0.8),rgba(252,228,236,0.6))';
let paperBorder = 'none';
let paperTextColor = '#4a4a4a';
let paperTitleColor = '#b71c1c';

if (paperStyle === 'vintage') {
    paperBg = 'linear-gradient(145deg, #fdf6e3, #eee8d5)';
    paperBorder = '1px solid #d4c4a1';
    paperTextColor = '#5c4a3d';
    paperTitleColor = '#8b5a2b';
} else if (paperStyle === 'elegant') {
    paperBg = '#ffffff';
    paperBorder = '1px solid #e0e0e0';
    paperTextColor = '#333333';
    paperTitleColor = '#111111';
}

let endingHtml = '';
if (letterEnding) {
    endingHtml = `<p style="font-size:18px;line-height:1.9;color:${paperTitleColor};margin-top:15px;font-family:'Dancing Script',cursive;text-align:right;font-weight:bold">${letterEnding}</p>`;
}

const LETTER = `<div style="text-align:center;margin:8px 0 16px;">
  <span style="font-size:26px;color:${paperTitleColor};font-family:'Dancing Script',cursive;letter-spacing:1px;text-shadow:0 2px 4px rgba(0,0,0,0.1);line-height:1.2">${letterTitle}</span>
  <div style="width:70%;margin:8px auto 0;height:2px;background:linear-gradient(to right,transparent,${paperTitleColor},transparent);border-radius:2px"></div>
</div>

<div style="background:${paperBg};border-radius:12px;padding:16px 18px;margin-bottom:16px;border:${paperBorder};box-shadow:inset 0 0 10px rgba(255,255,255,0.5), 0 4px 15px rgba(0,0,0,0.05)">
  <p style="font-size:16px;line-height:1.9;color:${paperTextColor};margin:0;font-family:'Comic Neue',cursive;text-align:left;white-space:pre-wrap">${letterMsg}</p>
  ${endingHtml}
</div>

<div style="position:relative;background:linear-gradient(135deg,rgba(255,245,247,0.7),rgba(252,228,236,0.4));border-radius:12px;padding:14px 16px;border:1px dashed rgba(216,27,96,0.4)">
  <div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:#fff;padding:0 8px;color:#f06292;font-size:18px">🌸</div>
  <p style="font-size:16px;line-height:1.8;color:#5d4037;margin:6px 0 0;font-family:'Comic Neue',cursive;text-align:center;font-style:italic;font-weight:bold">
    "${letterQuote}"
  </p>
</div>`;

// Set the global messages for petals.js (inlined in index.html)
window.UNIVERSE_MSGS = letterUniverse.split(',').map(s => s.trim()).filter(s => s !== "");
// Fallback if empty
if (window.UNIVERSE_MSGS.length === 0) {
    window.UNIVERSE_MSGS = ["Happy Women's Day", "Yêu bạn nhiều ❤️", "8/3 💕"];
}

/* ============ GARDEN ============ */
(function () {
    const g = document.getElementById('garden');
    const gc = ['#1a6b30', '#2d8a4e', '#145224', '#0d4520', '#1e7b38', '#0b3a18'];
    for (let i = 0; i < 150; i++) { const b = document.createElement('div'); b.className = 'grass-blade'; const h = 30 + Math.random() * 130; b.style.cssText = `left:${Math.random() * 100}%;height:${h}px;width:${4 + Math.random() * 6}px;background:linear-gradient(to top,${gc[Math.random() * gc.length | 0]},${gc[Math.random() * gc.length | 0]});transform:rotate(${Math.random() * 16 - 8}deg);border-radius:80% 80% 0 0;z-index:${h > 80 ? 3 : 1};animation:sw ${2 + Math.random() * 3}s ${Math.random() * 2}s ease-in-out infinite`; g.appendChild(b) }
    for (let i = 0; i < 8; i++) { const l = document.createElement('div'); l.className = 'leaf'; l.style.cssText = `width:${30 + Math.random() * 30}px;height:${20 + Math.random() * 12}px;bottom:${Math.random() * 8}%;left:${30 + Math.random() * 40}%;transform:rotate(${Math.random() * 60 - 30}deg);z-index:2`; g.appendChild(l) }

    // Flower types: original, tulip, rose, daisy
    const flowerTypes = ['original', 'tulip', 'rose', 'daisy', 'original', 'tulip', 'rose', 'daisy'];
    const tulipColors = [
        ['#ff5252', '#d32f2f'], ['#ff4081', '#c2185b'], ['#e040fb', '#9c27b0'],
        ['#ff6e40', '#e64a19'], ['#ffab40', '#ff6d00']
    ];
    const roseColors = [
        ['#f44336', '#c62828'], ['#e91e63', '#ad1457'], ['#ff8a80', '#ff5252'],
        ['#f48fb1', '#e91e63'], ['#ce93d8', '#9c27b0']
    ];

    const fd = [
        { l: '3%', h: 110, type: 'rose' },
        { l: '5%', h: 100, type: 'daisy' },
        { l: '9%', h: 150, type: 'original' },
        { l: '12%', h: 140, type: 'tulip' },
        { l: '16%', h: 180, type: 'daisy' },
        { l: '20%', h: 170, type: 'original' },
        { l: '24%', h: 160, type: 'tulip' },
        { l: '28%', h: 190, type: 'rose' },
        { l: '32%', h: 150, type: 'daisy' },
        { l: '36%', h: 160, type: 'tulip' },
        { l: '40%', h: 180, type: 'rose' },
        { l: '44%', h: 210, type: 'original' },
        { l: '48%', h: 170, type: 'tulip' },
        { l: '52%', h: 180, type: 'daisy' },
        { l: '56%', h: 160, type: 'original' },
        { l: '60%', h: 200, type: 'tulip' },
        { l: '64%', h: 140, type: 'daisy' },
        { l: '68%', h: 170, type: 'rose' },
        { l: '72%', h: 190, type: 'tulip' },
        { l: '76%', h: 150, type: 'original' },
        { l: '80%', h: 170, type: 'rose' },
        { l: '85%', h: 130, type: 'tulip' },
        { l: '89%', h: 150, type: 'daisy' },
        { l: '93%', h: 120, type: 'rose' },
        { l: '97%', h: 140, type: 'original' },
    ];

    fd.forEach((f, i) => {
        const fw = document.createElement('div');
        fw.className = 'flower';
        fw.style.cssText = `left:${f.l};transform:translateX(-50%);z-index:4`;

        const st = document.createElement('div');
        st.className = 'f-stem';
        st.style.cssText = `height:0;animation:gs 1.5s ${i * .2}s forwards;--sh:${Math.min(f.h, innerHeight * .35)}px`;

        if (f.type === 'original') {
            // Original pink flower
            const hd = document.createElement('div');
            hd.className = 'f-head';
            for (let p = 0; p < 7; p++) {
                const pt = document.createElement('div');
                pt.className = 'f-petal';
                pt.style.opacity = '0';
                pt.style.animation = `pi .6s ${i * .2 + 1.5 + p * .1}s forwards`;
                hd.appendChild(pt);
            }
            const ct = document.createElement('div');
            ct.className = 'f-center';
            ct.style.opacity = '0';
            ct.style.animation = `pi .4s ${i * .2 + 2.2}s forwards`;
            hd.appendChild(ct);
            st.appendChild(hd);

        } else if (f.type === 'tulip') {
            const tc = tulipColors[Math.random() * tulipColors.length | 0];
            const hd = document.createElement('div');
            hd.className = 'tulip-head';
            for (let p = 0; p < 3; p++) {
                const pt = document.createElement('div');
                pt.className = 'tulip-petal';
                pt.style.background = `linear-gradient(180deg, ${tc[0]}, ${tc[1]})`;
                pt.style.boxShadow = `inset 0 -4px 8px rgba(0,0,0,.15)`;
                pt.style.opacity = '0';
                pt.style.animation = `pi .5s ${i * .2 + 1.5 + p * .12}s forwards`;
                hd.appendChild(pt);
            }
            st.appendChild(hd);

        } else if (f.type === 'rose') {
            const rc = roseColors[Math.random() * roseColors.length | 0];
            const hd = document.createElement('div');
            hd.className = 'rose-head';
            for (let p = 0; p < 4; p++) {
                const pt = document.createElement('div');
                pt.className = 'rose-petal';
                const shade = p < 2 ? rc[0] : rc[1];
                pt.style.background = `radial-gradient(circle at 40% 40%, ${shade}, ${rc[1]})`;
                pt.style.boxShadow = `inset 0 -2px 4px rgba(0,0,0,.15), 0 0 6px ${rc[0]}44`;
                pt.style.opacity = '0';
                pt.style.animation = `pi .5s ${i * .2 + 1.5 + p * .12}s forwards`;
                hd.appendChild(pt);
            }
            const ct = document.createElement('div');
            ct.className = 'rose-center';
            ct.style.opacity = '0';
            ct.style.animation = `pi .4s ${i * .2 + 2.2}s forwards`;
            hd.appendChild(ct);
            st.appendChild(hd);

        } else if (f.type === 'daisy') {
            const hd = document.createElement('div');
            hd.className = 'daisy-head';
            const petalCount = 8;
            for (let p = 0; p < petalCount; p++) {
                const pt = document.createElement('div');
                pt.className = 'daisy-petal';
                const angle = (360 / petalCount) * p;
                pt.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
                pt.style.transformOrigin = 'center bottom';
                pt.style.opacity = '0';
                pt.style.animation = `pi .4s ${i * .2 + 1.5 + p * .06}s forwards`;
                hd.appendChild(pt);
            }
            const ct = document.createElement('div');
            ct.className = 'daisy-center';
            ct.style.opacity = '0';
            ct.style.animation = `pi .4s ${i * .2 + 2.2}s forwards`;
            hd.appendChild(ct);
            st.appendChild(hd);
        }

        fw.appendChild(st);
        g.appendChild(fw);
    });

    const s = document.createElement('style');
    s.textContent = '@keyframes sw{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}@keyframes gs{to{height:var(--sh)}}@keyframes pi{to{opacity:1}}';
    document.head.appendChild(s);
})();

/* ============ FIREFLIES ============ */
const fc = document.getElementById('fireflies'), fx = fc.getContext('2d');
let FW, FH; function rF() { FW = fc.width = innerWidth; FH = fc.height = innerHeight } rF(); addEventListener('resize', rF);
class Fly { constructor() { this.x = Math.random() * FW; this.y = Math.random() * FH * .6; this.vx = (Math.random() - .5) * .3; this.vy = (Math.random() - .5) * .2; this.r = Math.random() * 2 + .8; this.a = 0; this.ta = Math.random() * .5 + .15; this.fs = Math.random() * .01 + .004; this.fd = 1; this.h = [50, 330, 45][Math.random() * 3 | 0] } update() { this.x += this.vx + Math.sin(Date.now() * .0007 + this.y * .01) * .2; this.y += this.vy + Math.cos(Date.now() * .0007 + this.x * .01) * .15; if (this.x < 0 || this.x > FW) this.vx *= -1; if (this.y < 0 || this.y > FH * .7) this.vy *= -1; this.a += this.fs * this.fd; if (this.a >= this.ta) this.fd = -1; if (this.a <= 0) { this.fd = 1; this.x = Math.random() * FW; this.y = Math.random() * FH * .5 } } draw() { fx.save(); fx.globalAlpha = this.a; fx.shadowBlur = 10; fx.shadowColor = `hsla(${this.h},100%,70%,.8)`; fx.fillStyle = `hsla(${this.h},100%,80%,1)`; fx.beginPath(); fx.arc(this.x, this.y, this.r, 0, Math.PI * 2); fx.fill(); fx.restore() } }
const flies = Array.from({ length: 20 }, () => new Fly());
(function aF() { fx.clearRect(0, 0, FW, FH); flies.forEach(f => { f.update(); f.draw() }); requestAnimationFrame(aF) })();

/* ============ PETALS ============ */
const pc = document.getElementById('petals'), px = pc.getContext('2d');
let PW, PH; function rP() { PW = pc.width = innerWidth; PH = pc.height = innerHeight } rP(); addEventListener('resize', rP);
const pC = ['#f8bbd0', '#f48fb1', '#f06292', '#fce4ec', '#fff'];
class Pt { constructor() { this.reset(true) } reset(i) { this.x = Math.random() * PW; this.y = i ? Math.random() * PH : -12; this.s = Math.random() * 5 + 2; this.vy = Math.random() * 1 + .3; this.vx = Math.random() - .5; this.r = Math.random() * 360; this.rs = Math.random() * 2 - 1; this.o = Math.random() * .35 + .15; this.c = pC[Math.random() * pC.length | 0]; this.w = Math.random() * Math.PI * 2; this.ws = Math.random() * .02 + .006 } update() { this.y += this.vy; this.w += this.ws; this.x += this.vx + Math.sin(this.w) * .35; this.r += this.rs; if (this.y > PH + 12) this.reset(false) } draw() { px.save(); px.translate(this.x, this.y); px.rotate(this.r * Math.PI / 180); px.globalAlpha = this.o; px.fillStyle = this.c; px.beginPath(); px.ellipse(0, 0, this.s, this.s * .5, 0, 0, Math.PI * 2); px.fill(); px.restore() } }
const pts = Array.from({ length: 30 }, () => new Pt());
(function aP() { px.clearRect(0, 0, PW, PH); pts.forEach(p => { p.update(); p.draw() }); requestAnimationFrame(aP) })();

/* ============ PHASE 1 → 2 ============ */
document.getElementById('phase1').addEventListener('click', () => {
    document.getElementById('phase1').classList.add('out');
    playMusic(); // Attempt to play music
    setTimeout(() => document.getElementById('phase2').classList.add('show'), 800); // Overlay disappears regardless
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
                letterNode.classList.add('expanded');
                setTimeout(() => {
                    document.getElementById('giftBtn').classList.add('show');
                    letterNode.scrollTop = 0;
                }, 1000);
            }, 500);
        }
    }
    type();
}

document.getElementById('giftBtn').addEventListener('click', () => {
    if (typeof window.initUniverse === 'function') window.initUniverse();
    playMusic();
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

/* ============ CREATOR MODE UI LOGIC ============ */
const creatorModal = document.getElementById('setup-modal');
const templateChips = document.querySelectorAll('#template-chips .chip');
const customTitleInput = document.getElementById('lover-name');
const customMsgInput = document.getElementById('custom-msg');
const customEndingInput = document.getElementById('custom-ending');
const generateLinkBtn = document.getElementById('create-link-btn');
const paperChips = document.querySelectorAll('#paper-chips .chip');
const outputZone = document.getElementById('result-area');
const generatedLinkInput = document.getElementById('generated-link');
const copyLinkBtn = document.getElementById('copy-btn');
const actionButtons = document.querySelectorAll('.action-btn');

// Decide if we are in Creator Mode or Viewing Mode
const isViewing = hashLocation.startsWith('#/share/') || urlParams.has('t') || urlParams.has('m') || urlParams.has('tmp');

if (!isViewing) {
    // Creator Mode Active: CSS handles hiding background and fixing scrolling
    document.body.classList.add('creator-only-mode');
}

window.onload = () => {
    if (!isViewing) {
        // Show the creator modal
        creatorModal.classList.add('show');
    }
};

// Handle Template Selection
templateChips.forEach(chip => {
    chip.addEventListener('click', () => {
        templateChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const val = chip.dataset.template;
        if (val === 'custom') {
            customTitleInput.value = '';
            customMsgInput.value = '';
            customEndingInput.value = '';
            document.getElementById('custom-quote').value = '';
            document.getElementById('custom-universe').value = '';
            customTitleInput.focus();
        } else if (TEMPLATES[val]) {
            // Strip out the html tags for the editor
            customTitleInput.value = TEMPLATES[val].title.replace(/<[^>]*>?/gm, '');
            customMsgInput.value = TEMPLATES[val].msg.replace(/<[^>]*>?/gm, '').replace(/<br>/g, '\n');
            customEndingInput.value = TEMPLATES[val].ending || '';
            document.getElementById('custom-quote').value = TEMPLATES[val].quote || '';
            document.getElementById('custom-universe').value = TEMPLATES[val].universe || '';
        }
    });
});

// Handle Paper Setup
paperChips.forEach(chip => {
    chip.addEventListener('click', () => {
        paperChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
    });
});

// Generate Link
generateLinkBtn.addEventListener('click', () => {
    const t = customTitleInput.value.trim();
    const m = customMsgInput.value.trim();
    const e_val = customEndingInput.value.trim();
    const q_val = document.getElementById('custom-quote').value.trim();
    const u_val = document.getElementById('custom-universe').value.trim();

    if (!t || !m) {
        alert("Vui lòng nhập cả tiêu đề và nội dung thư nhé!");
        return;
    }

    const activePaper = document.querySelector('.paper-chip.active');
    const p = activePaper ? activePaper.dataset.style : 'pink';

    let formattedMsg = m.replace(/\n/g, '<br>');

    // Check if user text exactly matches any existing template to save massive space
    let matchedTmp = null;
    for (const key in TEMPLATES) {
        if (key === 'all') continue; // Skip default empty view
        const tmp = TEMPLATES[key];
        const tmpTitle = tmp.title.replace(/<[^>]*>?/gm, '');
        const tmpMsg = tmp.msg.replace(/<[^>]*>?/gm, '').replace(/\n/g, '<br>');
        const tmpEnding = tmp.ending || '';

        if (t === tmpTitle && formattedMsg === tmpMsg && e_val === tmpEnding) {
            matchedTmp = key;
            break;
        }
    }

    // Create a compact JSON object for sharing
    const shareData = {};
    if (matchedTmp) {
        shareData.tmp = matchedTmp;
    } else {
        shareData.t = t;
        shareData.m = formattedMsg;
        if (e_val) shareData.e = e_val;
    }
    // Always preserve custom quote and universe text if provided
    if (q_val) shareData.q = q_val;
    if (u_val) shareData.u = u_val;
    if (p && p !== 'pink') shareData.p = p;

    // Encode string payload using LZString for optimal compression, fallback to base64 if it fails
    let encodedData = '';
    if (typeof LZString !== 'undefined') {
        encodedData = LZString.compressToEncodedURIComponent(JSON.stringify(shareData));
    } else {
        encodedData = btoa(unescape(encodeURIComponent(JSON.stringify(shareData))));
    }

    const baseUrl = window.location.href.split('?')[0].split('#')[0];
    const url = `${baseUrl}#/share/${encodedData}`;

    generatedLinkInput.value = url;
    outputZone.classList.remove('hidden');

    // Also show QR Code section for the copied UI
    document.getElementById('qr-code-container').classList.remove('hidden');

    // Generate the QR Code payload
    generateQRCode(url);
});

// Copy Link
copyLinkBtn.addEventListener('click', () => {
    generatedLinkInput.select();
    document.execCommand('copy');
    copyLinkBtn.innerHTML = '<i class="fas fa-check" style="color: white; font-size: 1.2rem;"></i>';
    copyLinkBtn.style.background = '#4caf50';

    setTimeout(() => {
        copyLinkBtn.innerHTML = '<i class="fas fa-copy" style="color: white; font-size: 1.2rem;"></i>';
        copyLinkBtn.style.background = ''; // Revert to CSS default
    }, 2000);
});

// ========== QR CODE ==========
function generateQRCode(url) {
    const qrContainer = document.getElementById('qr-code');
    if (!qrContainer) return;

    qrContainer.innerHTML = ''; // Clear existing

    // Generate QR
    new QRCode(qrContainer, {
        text: url,
        width: 180,
        height: 180,
        colorDark: "#590d22",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

function downloadQRCode() {
    const qrContainer = document.getElementById('qr-code');
    const img = qrContainer?.querySelector('img');

    if (img && img.src) {
        const link = document.createElement('a');
        link.download = 'loi-chuc-8-3-qr.png';
        link.href = img.src;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        // Fallback for canvas if img not ready (qrcodejs uses canvas first then img)
        const canvas = qrContainer?.querySelector('canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'loi-chuc-8-3-qr.png';
            link.href = canvas.toDataURL();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

// Hook up download button
document.getElementById('download-qr-btn').addEventListener('click', downloadQRCode);

// ========== SHARE BUTTONS ==========
function initActionButtons() {
    const shareUrl = () => document.getElementById('generated-link')?.value || window.location.href;

    // Facebook
    document.getElementById('action-fb')?.addEventListener('click', (e) => {
        e.preventDefault();
        const url = shareUrl();
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
    });

    // Zalo
    document.getElementById('action-zalo')?.addEventListener('click', (e) => {
        e.preventDefault();
        const url = shareUrl();
        window.open(`https://zalo.me/share?url=${encodeURIComponent(url)}`, '_blank');
    });

    // Messenger
    document.getElementById('action-messenger')?.addEventListener('click', (e) => {
        e.preventDefault();
        const url = shareUrl();
        window.open(`fb-messenger://share?link=${encodeURIComponent(url)}`, '_blank');
    });

    // Native share - chỉ copy URL
    document.getElementById('action-native')?.addEventListener('click', (e) => {
        e.preventDefault();
        const url = shareUrl();

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => {
                alert('Đã copy link! 📋');
            }).catch(() => {
                fallbackCopyUrl(url);
            });
        } else {
            fallbackCopyUrl(url);
        }
    });

    function fallbackCopyUrl(url) {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.cssText = 'position:fixed;opacity:0;';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            alert('Đã copy link! 📋');
        } catch (err) {
            alert('Không thể copy!');
        }
        document.body.removeChild(textarea);
    }
}

// Preview Link Button
document.getElementById('go-to-link-btn')?.addEventListener('click', () => {
    const link = document.getElementById('generated-link')?.value;
    if (link) {
        window.open(link, '_blank');
    }
});

// Initialize share buttons
initActionButtons();
