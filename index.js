document.addEventListener('DOMContentLoaded', () => {
    const giftBox = document.getElementById('gift-box');
    const landingScreen = document.getElementById('landing-screen');
    const messageScreen = document.getElementById('message-screen');
    const nameContainer = document.getElementById('name-container');
    const cakeLayers = document.querySelectorAll('.cake-layer');
    const cakeFrosting = document.querySelector('.cake-frosting');
    const candles = document.querySelectorAll('.candle');
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');

    // 1. Particle Systems
    let rainParticles = [];
    let confettiParticles = [];
    let isLanding = true;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor(isRain = false) {
            this.isRain = isRain;
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = this.isRain ? Math.random() * canvas.height : -20;
            this.size = Math.random() * (this.isRain ? 4 : 8) + 2;
            this.color = this.isRain ? `rgba(255, 143, 163, ${Math.random() * 0.4 + 0.1})` : `hsl(${Math.random() * 20 + 340}, 100%, 70%)`;
            this.speedX = (Math.random() - 0.5) * (this.isRain ? 1 : 4);
            this.speedY = this.isRain ? Math.random() * 1 + 0.5 : Math.random() * 5 + 2;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 4 - 2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            if (this.y > canvas.height) {
                if (this.isRain) {
                    this.y = -10;
                    this.x = Math.random() * canvas.width;
                }
            }
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            if (this.isRain) {
                // Draw small hearts or circles for rain
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
            }
            ctx.restore();
        }
    }

    // Initialize Rain
    for (let i = 0; i < 50; i++) rainParticles.push(new Particle(true));

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (isLanding) {
            rainParticles.forEach(p => { p.update(); p.draw(); });
        }
        
        confettiParticles.forEach((p, index) => {
            p.update();
            p.draw();
            if (p.y > canvas.height && !isLanding) confettiParticles.splice(index, 1);
        });
        
        requestAnimationFrame(animate);
    }
    animate();

    // 2. Animate Name (Para mi niña hermosa ❤️)
    const nameText = "Para mi niña hermosa ❤️";
    nameText.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.classList.add('letter');
        nameContainer.appendChild(span);
        setTimeout(() => span.classList.add('reveal'), 70 * index);
    });

    // 3. Interaction
    giftBox.addEventListener('click', () => {
        giftBox.classList.add('gift-open');
        
        setTimeout(() => {
            isLanding = false;
            landingScreen.classList.remove('active');
            messageScreen.classList.add('active');
            
            // Trigger Confetti Burst
            for(let i=0; i<100; i++) confettiParticles.push(new Particle(false));

            // Assemble Cake
            cakeLayers.forEach((layer, index) => {
                setTimeout(() => layer.classList.add('assembled'), 500 * (index + 1));
            });

            setTimeout(() => {
                cakeFrosting.style.opacity = '1';
                candles.forEach(c => c.style.opacity = '1');
            }, 2000);

        }, 800);
    });
});
