import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';


gsap.registerPlugin(ScrollTrigger);

export function initAnimations(threeScene?: any) {
  // 1. Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // 2. Link Scroll Progress to Three.js Background Scene (if present)
  const scrollState = { progress: 0 };
  
  gsap.to(scrollState, {
    progress: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '#app-content',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        if (threeScene) {
          threeScene.setScrollProgress(self.progress);
        }
      }
    }
  });

  // 3. Intro Load Animations (Typography Reveal Masks & Staggers)
  const introTl = gsap.timeline();
  
  // Reveal text mask slide up
  introTl.fromTo('.text-reveal-item', 
    { yPercent: 100 },
    { yPercent: 0, duration: 1.1, stagger: 0.15, ease: 'power4.out' }
  );

  // Fade and spring the top badge
  introTl.fromTo('.hero-badge', 
    { opacity: 0, scale: 0.9, y: -10 },
    { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' },
    '-=0.8'
  );
  
  introTl.fromTo('.subheadline', 
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
    '-=0.5'
  );
  
  introTl.fromTo('.hero-ctas', 
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
    '-=0.4'
  );

  introTl.fromTo('.hero-proof-row',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
    '-=0.35'
  );
  
  // Stagger entry of the dashboard container
  introTl.fromTo('.dashboard-mockup',
    { opacity: 0, y: 80, scale: 0.95, rotateX: 5 },
    { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 1.4, ease: 'power4.out' },
    '-=0.3'
  );

  // Spending Stats Chart Bars Animating Up
  const bars = document.querySelectorAll('.chart-bar');
  gsap.fromTo(bars, 
    { height: 0 }, 
    { 
      height: (_, target) => {
        return (target as HTMLElement).style.getPropertyValue('--bar-height') || '50%';
      },
      duration: 1.2,
      stagger: 0.04,
      ease: 'power3.out',
      delay: 1.2
    }
  );

  // Donut segment fill animation
  const donutOrange = document.querySelector('.donut-segment-orange');
  const donutBlue = document.querySelector('.donut-segment-blue');
  if (donutOrange && donutBlue) {
    gsap.fromTo([donutOrange, donutBlue],
      { strokeDasharray: '0 100', strokeDashoffset: 100 },
      {
        strokeDasharray: (index) => index === 0 ? '60 40' : '25 75',
        strokeDashoffset: (index) => index === 0 ? '25' : '85',
        duration: 1.5,
        ease: 'power2.out',
        delay: 1.4
      }
    );
  }

  // Animate Floating Cards on Load (Spring in)
  const floatCards = document.querySelectorAll('.float-card');
  floatCards.forEach((card, index) => {
    const depth = parseFloat((card as HTMLElement).dataset.depth || '0.2');
    
    // Stagger slide-in directions on load
    let startX = index < 2 ? -60 : 60;
    let startY = index % 2 === 0 ? -40 : 40;

    gsap.fromTo(card, 
      { opacity: 0, scale: 0.7, x: startX, y: startY },
      { 
        opacity: 1, 
        scale: 1, 
        x: 0,
        y: 0,
        z: 120 + depth * 150, // High Z-plane foreground
        duration: 1.4, 
        delay: 0.6 + index * 0.1,
        ease: 'back.out(1.8)'
      }
    );
  });

  // 4. Pinned Scroll Showcase Parallax (fora.so style)
  const heroDesktop = window.matchMedia('(min-width: 1025px)').matches;
  const pinTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '+=52%',
      pin: true,
      scrub: 0.5
    }
  });

  // Fade out hero text
  pinTimeline.to('.hero-text-container', {
    opacity: 0,
    x: heroDesktop ? -70 : 0,
    y: -42,
    duration: 0.2,
    ease: 'power1.out'
  }, 0);

  // Move the right-side dashboard into a centered showcase position
  pinTimeline.to('.parallax-scene-wrapper', {
    xPercent: heroDesktop ? -28 : 0,
    scale: 1,
    duration: 0.35,
    ease: 'power1.inOut'
  }, 0.04);

  // Flatten & Zoom dashboard mockup
  pinTimeline.to('.dashboard-mockup', {
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
    y: heroDesktop ? 0 : -8,
    duration: 0.3,
    ease: 'power1.inOut'
  }, 0.05);

  // Flatten floating cards
  pinTimeline.to('.float-card', {
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    duration: 0.3,
    ease: 'power1.inOut'
  }, 0.05);

  // Parallax glide floating cards
  floatCards.forEach((card) => {
    const depth = parseFloat((card as HTMLElement).dataset.depth || '0.2');
    pinTimeline.to(card, {
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      y: -100 * depth,
      duration: 0.3,
      ease: 'power1.inOut'
    }, 0.05);
  });



  // 5. 3D Hover Parallax (Mouse Move Tilt Effect)
  const wrapper = document.querySelector('.parallax-scene-wrapper');
  const container = document.querySelector('.dashboard-3d-container');

  if (wrapper && container) {
    wrapper.addEventListener('mousemove', (e: any) => {
      const rect = wrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const rotateX = -y * 22;
      const rotateY = x * 26;

      gsap.to(container, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    wrapper.addEventListener('mouseleave', () => {
      gsap.to(container, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  }

  // 6. Section Scroll Animations
  const contentBoxes = document.querySelectorAll('.content-box');
  contentBoxes.forEach((box) => {
    gsap.to(box, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: box,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play reverse play reverse',
      }
    });
  });

  // Stats Counter Animation on Scroll
  const stats = document.querySelectorAll('.stat-num');
  stats.forEach((stat) => {
    const target = parseInt(stat.getAttribute('data-target') || '0');
    const hasDollar = stat.textContent?.includes('$');
    
    const countObj = { value: 0 };
    gsap.to(countObj, {
      value: target,
      duration: 2.0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.hero-stats-bar',
        start: 'top 85%'
      },
      onUpdate: () => {
        const currentVal = Math.floor(countObj.value);
        stat.textContent = hasDollar ? `$${currentVal}` : `${currentVal}`;
      }
    });
  });

  // Micro-interactions for buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { scale: 1.02, duration: 0.2, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { scale: 1.0, duration: 0.2, ease: 'power2.out' });
    });
  });
}
