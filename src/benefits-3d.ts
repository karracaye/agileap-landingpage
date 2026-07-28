import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class Benefits3D {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  
  // 3D Objects
  private meshGroup: THREE.Group;
  private wireframePolyhedron: THREE.Mesh;
  private innerPolyhedron: THREE.Mesh;
  private particleCloud: THREE.Points;
  
  // Mouse state
  private mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  private animationFrameId: number | null = null;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    
    // Camera
    const rect = canvas.parentElement?.getBoundingClientRect() || { width: window.innerWidth, height: 600 };
    this.camera = new THREE.PerspectiveCamera(50, rect.width / rect.height, 0.1, 100);
    this.camera.position.set(0, 0, 8);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(rect.width, rect.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Group container
    this.meshGroup = new THREE.Group();
    this.scene.add(this.meshGroup);

    // 1. Create Outer Wireframe Polyhedron (Brand Colors: #E55B1B Orange & #0066ff Blue accents)
    const geoOuter = new THREE.IcosahedronGeometry(2.4, 1);
    const matWire = new THREE.MeshBasicMaterial({
      color: 0xE55B1B,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    this.wireframePolyhedron = new THREE.Mesh(geoOuter, matWire);
    this.meshGroup.add(this.wireframePolyhedron);

    // 2. Create Inner Solid Core
    const geoInner = new THREE.OctahedronGeometry(1.2, 0);
    const matInner = new THREE.MeshBasicMaterial({
      color: 0x0066ff,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    this.innerPolyhedron = new THREE.Mesh(geoInner, matInner);
    this.meshGroup.add(this.innerPolyhedron);

    // 3. Create Ambient Floating Particle Cloud
    const particleCount = 120;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const pMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.05,
      transparent: true,
      opacity: 0.4
    });
    this.particleCloud = new THREE.Points(pGeo, pMat);
    this.meshGroup.add(this.particleCloud);

    // Setup Event Listeners & GSAP Parallax
    this.setupEvents();
    this.initScrollParallax();
    this.animate();
  }

  private setupEvents() {
    window.addEventListener('resize', () => {
      if (!this.canvas.parentElement) return;
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.camera.aspect = rect.width / rect.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(rect.width, rect.height);
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 0.4;
      this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 0.4;
    });
  }

  private initScrollParallax() {
    const section = document.querySelector('#invoicenow-benefits');
    if (!section) return;

    // 3D Mesh Scroll Rotation
    gsap.to(this.meshGroup.rotation, {
      y: Math.PI * 1.5,
      x: Math.PI * 0.5,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2
      }
    });

    // 5-Card Parallax Float
    const cards = section.querySelectorAll<HTMLElement>('.minimal-card');
    cards.forEach((card) => {
      const depth = parseFloat(card.getAttribute('data-parallax-depth') || '0.1');
      gsap.fromTo(card,
        { y: depth * 60 },
        {
          y: depth * -60,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        }
      );
    });
  }

  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    // Smooth mouse lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Idle rotation
    this.wireframePolyhedron.rotation.y += 0.003;
    this.wireframePolyhedron.rotation.x += 0.0015;

    this.innerPolyhedron.rotation.y -= 0.006;
    this.innerPolyhedron.rotation.z += 0.003;

    this.particleCloud.rotation.y += 0.001;

    // Mouse tilt application
    this.meshGroup.rotation.x = this.mouse.y * 0.5;
    this.meshGroup.rotation.y = this.mouse.x * 0.5;

    this.renderer.render(this.scene, this.camera);
  };

  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.renderer.dispose();
  }
}
