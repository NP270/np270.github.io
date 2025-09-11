const canvas = document.getElementById("vortex");
					const ctx = canvas.getContext("2d");
					const simplex = new SimplexNoise();
					const container = document.querySelector(".countdown-wrapper");

				let width, height, centerX, centerY, rangeX, rangeY;

				function resize() {
				width = container.offsetWidth;
				height = container.offsetHeight;
				canvas.width = width;
				canvas.height = height;

				centerX = width / 2;
				centerY = height / 2;

				rangeX = width / 2;
				rangeY = height / 2;
				}
					window.addEventListener("resize", resize);
					resize();

					const particleCount = 700;
					const propsPerParticle = 9;
					const propsLength = particleCount * propsPerParticle;
					const props = new Float32Array(propsLength);
					const baseTTL = 50, rangeTTL = 150;
					const baseSpeed = 0.0, rangeSpeed = 1.5;
					const baseRadius = 1, rangeRadius = 2;
					const baseHue = 220, rangeHue = 100;
					const noiseSteps = 3;
					const xOff = 0.00125, yOff = 0.00125, zOff = 0.0005;
					let tick = 0;

					function rand(n) { return n * Math.random(); }
					function randRange(n) { return n - rand(2 * n); }
					function fadeInOut(t, m) {
					let hm = 0.5 * m;
					return Math.abs(((t + hm) % m) - hm) / hm;
					}
					function lerp(n1, n2, speed) {
					return (1 - speed) * n1 + speed * n2;
					}

					function initParticle(i) {
						let x = centerX + randRange(rangeX);
						let y = centerY + randRange(rangeY);
						let vx = 0, vy = 0, life = 0;
						let ttl = baseTTL + rand(rangeTTL);
						let speed = baseSpeed + rand(rangeSpeed);
						let radius = baseRadius + rand(rangeRadius);
						let hue = baseHue + rand(rangeHue);
						props.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
						}

					function initParticles() {
					for (let i = 0; i < propsLength; i += propsPerParticle) {
						initParticle(i);
					}
					}

					function drawParticle(x, y, x2, y2, life, ttl, radius, hue) {
					ctx.save();
					ctx.lineCap = "round";
					ctx.lineWidth = radius;
					ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
					ctx.beginPath();
					ctx.moveTo(x, y);
					ctx.lineTo(x2, y2);
					ctx.stroke();
					ctx.closePath();
					ctx.restore();
					}

					function updateParticle(i) {
					let i2 = 1 + i, i3 = 2 + i, i4 = 3 + i, i5 = 4 + i, i6 = 5 + i, i7 = 6 + i, i8 = 7 + i, i9 = 8 + i;
					let x = props[i], y = props[i2];
					let n = simplex.noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * Math.PI * 2;
					let vx = lerp(props[i3], Math.cos(n), 0.5);
					let vy = lerp(props[i4], Math.sin(n), 0.5);
					let life = props[i5], ttl = props[i6], speed = props[i7];
					let x2 = x + vx * speed, y2 = y + vy * speed;
					let radius = props[i8], hue = props[i9];
					drawParticle(x, y, x2, y2, life, ttl, radius, hue);
					life++;
					props[i] = x2; props[i2] = y2; props[i3] = vx; props[i4] = vy; props[i5] = life;
					if (x > width || x < 0 || y > height || y < 0 || life > ttl) {
						initParticle(i);
					}
					}

					function renderGlow() {
					ctx.save();
					ctx.filter = "blur(8px) brightness(200%)";
					ctx.globalCompositeOperation = "lighter";
					ctx.drawImage(canvas, 0, 0);
					ctx.restore();
					ctx.save();
					ctx.filter = "blur(4px) brightness(200%)";
					ctx.globalCompositeOperation = "lighter";
					ctx.drawImage(canvas, 0, 0);
					ctx.restore();
					}

					function animate() {
					tick++;
					ctx.clearRect(0, 0, width, height);
					ctx.fillStyle = "black";
					ctx.fillRect(0, 0, width, height);
					for (let i = 0; i < propsLength; i += propsPerParticle) {
						updateParticle(i);
					}
					renderGlow();
					ctx.save();
					ctx.globalCompositeOperation = "lighter";
					ctx.drawImage(canvas, 0, 0);
					ctx.restore();
					requestAnimationFrame(animate);
					}

					initParticles();
					animate();