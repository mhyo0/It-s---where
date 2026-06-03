import React, { useEffect, useRef } from 'react';

const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas.getContext('2d');
    if (!c) return;
    const mouse: { x?: number; y?: number } = {};
    const maxRadius = 40;
    const minRadius = 2;
    const colorArray = ['#233656', '#415B76', '#7B9BA6', '#CDD6D5', '#EEF4F2']; // dimmer whites

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    const mouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', mouseMove);
    const resize = () => {
      setSize();
      init();
    };
    window.addEventListener('resize', resize);

    function Circle(x: number, y: number, dx: number, dy: number, radius: number) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.radius = radius;
      this.minRadius = radius;
      this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

      this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
      };

      this.update = function () {
        this.dx = this.x + this.radius > innerWidth || this.x - this.radius < 0 ? -this.dx : this.dx;
        this.dy = this.y + this.radius > innerHeight || this.y - this.radius < 0 ? -this.dy : this.dy;
        this.x += this.dx;
        this.y += this.dy;

        if (
          mouse.x !== undefined &&
          mouse.y !== undefined &&
          mouse.x - this.x < 50 &&
          mouse.x - this.x > -50 &&
          mouse.y - this.y < 50 &&
          mouse.y - this.y > -50
        ) {
          if (this.radius < maxRadius) this.radius += 1;
        } else if (this.radius > this.minRadius) {
          this.radius -= 1;
        }
        this.draw();
      };
    }

    let circles: any[] = [];
    const init = () => {
      circles = [];
      for (let i = 0; i < 800; i++) {
        const radius = Math.random() * 3 + 1;
        const x = Math.random() * (innerWidth - radius * 2) + radius;
        const y = Math.random() * (innerHeight - radius * 2) + radius;
        const dx = Math.random() - 0.5;
        const dy = Math.random() - 0.5;
        circles.push(new Circle(x, y, dx, dy, radius));
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      c.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = 0; i < circles.length; i++) {
        circles[i].update();
      }
    };

    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

export default ParticleCanvas;
