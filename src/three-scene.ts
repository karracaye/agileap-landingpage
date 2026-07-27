import * as THREE from 'three';

export class ThreeScene {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  
  // 3D random drifting particles (No waves, no grid) - Subtle
  private particles!: THREE.Points;
  private particleCount = 280;
  
  // Lights
  private blueLight!: THREE.PointLight;
  private orangeLight!: THREE.PointLight;
  
  // State
  private clock = new THREE.Clock();
  private scrollProgress = 0;
  private mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  private animationFrameId: number | null = null;
  
  // Pre-bound event handlers for cleanup
  private onResizeBound = this.onResize.bind(this);
  private onMouseMoveBound = this.onMouseMove.bind(this);
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    
    // Scene setup
    this.scene = new THREE.Scene();
    
    // Subtle fog to create atmospheric depth
    this.scene.fog = new THREE.FogExp2(0xffffff, 0.06);
    
    // Camera settings
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 0, 5.5);
    
    // WebGL Renderer with alpha transparency enabled
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create Lights
    this.setupLights();
    
    // Initialize random particle dust field (No waves)
    this.createParticleField();
    
    // Event listeners
    this.setupListeners();
    
    // Start animation loop
    this.animate();
  }
  
  private setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    // Faint point lights to illuminate the depth
    this.blueLight = new THREE.PointLight(0x0066ff, 4, 12);
    this.blueLight.position.set(-3, 2, 1);
    this.scene.add(this.blueLight);
    
    this.orangeLight = new THREE.PointLight(0xff6b00, 4, 12);
    this.orangeLight.position.set(3, -2, 1);
    this.scene.add(this.orangeLight);
  }
  
  private createParticleField() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    
    const colorOrange = new THREE.Color(0xff6b00);
    const colorBlue = new THREE.Color(0x0066ff);
    
    // Scatter particles randomly in a 3D box bounding volume
    for (let i = 0; i < this.particleCount; i++) {
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 6 - 1.5; // scattered in depth
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Left-to-right color gradient based on X position
      const ratio = (x + 6) / 12;
      const mixedColor = new THREE.Color().lerpColors(colorOrange, colorBlue, ratio);
      
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Create soft circular dot texture
    const dotCanvas = document.createElement('canvas');
    dotCanvas.width = 32;
    dotCanvas.height = 32;
    const ctx = dotCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    const dotTexture = new THREE.CanvasTexture(dotCanvas);
    
    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.055, // Small particles as requested
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    this.particles = new THREE.Points(geometry, pointsMaterial);
    this.scene.add(this.particles);
  }
  
  private setupListeners() {
    window.addEventListener('resize', this.onResizeBound);
    window.addEventListener('mousemove', this.onMouseMoveBound);
  }
  
  private onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  
  private onMouseMove(e: MouseEvent) {
    this.mouse.targetX = (e.clientX / window.innerWidth) - 0.5;
    this.mouse.targetY = -(e.clientY / window.innerHeight) + 0.5;
  }
  
  public setScrollProgress(progress: number) {
    this.scrollProgress = progress;
  }
  
  private animate() {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    
    const elapsedTime = this.clock.getElapsedTime();
    
    // Slow cursor tracking
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.035;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.035;
    
    this.camera.position.x = this.mouse.x * 1.5;
    this.camera.position.y = this.mouse.y * 1.2;
    this.camera.lookAt(0, 0, -2);
    
    // Slow drift drift animation (No waves)
    const positions = this.particles.geometry.attributes.position.array as Float32Array;
    for (let i = 1; i < positions.length; i += 3) {
      // Float particles slowly upwards
      positions[i] += 0.0022;
      
      // If a particle rises off the top of the viewport, reset it to the bottom
      if (positions[i] > 4.5) {
        positions[i] = -4.5;
      }
    }
    this.particles.geometry.attributes.position.needsUpdate = true;
    
    // Slow, subtle rotation of the entire particle cloud
    this.particles.rotation.y = elapsedTime * 0.012;
    this.particles.rotation.x = elapsedTime * 0.005;
    
    // Zoom in slightly on scroll progress
    const scrollZ = this.scrollProgress;
    this.camera.position.z = 5.5 - scrollZ * 2.2;
    
    // Rotate point lights to shift colors softly
    this.blueLight.position.x = Math.sin(elapsedTime * 0.4) * 3;
    this.blueLight.position.z = Math.cos(elapsedTime * 0.4) * 3;
    
    this.orangeLight.position.x = Math.sin(elapsedTime * 0.2 + Math.PI) * 3;
    this.orangeLight.position.z = Math.cos(elapsedTime * 0.2 + Math.PI) * 3;
    
    this.renderer.render(this.scene, this.camera);
  }
  
  public destroy() {
    window.removeEventListener('resize', this.onResizeBound);
    window.removeEventListener('mousemove', this.onMouseMoveBound);
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.renderer.dispose();
  }
}
