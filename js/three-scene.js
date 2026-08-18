/* ============================================
   THREE.JS HERO SCENE
   Interactive 3D Developer Workspace
   ============================================ */

(function() {
    'use strict';
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const isMobile = window.innerWidth < 768;
    
    // Configuration
    const config = {
        particleCount: isMobile ? 30 : 60,
        connectionDistance: 120,
        mouseInfluence: 150,
        rotationSpeed: 0.0005,
        colors: {
            primary: 0x8B5CF6,    // Violet
            secondary: 0x6366F1, // Indigo
            accent: 0xA78BFA,    // Light violet
            background: 0x070709 // Dark background
        }
    };
    
    // Scene variables
    let scene, camera, renderer;
    let particles, particleGeometry, particleMaterial;
    let connections;
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;
    let animationId;
    let isVisible = true;
    
    // DOM Elements
    const canvas = document.getElementById('heroCanvas');
    const heroSection = document.getElementById('home');
    
    // Initialize scene
    function init() {
        if (!canvas || prefersReducedMotion) {
            // Create fallback static visual
            createFallbackVisual();
            return;
        }
        
        // Setup scene
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(config.colors.background, 0.002);
        
        // Setup camera
        const aspect = canvas.parentElement.offsetWidth / canvas.parentElement.offsetHeight;
        camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        camera.position.z = 300;
        
        // Setup renderer
        renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        
        // Create scene elements
        createParticles();
        createGeometricShapes();
        createFloatingElements();
        createAmbientLight();
        
        // Event listeners
        setupEventListeners();
        
        // Start animation
        animate();
        
        // Intersection Observer for performance
        setupIntersectionObserver();
    }
    
    // Create particle system
    function createParticles() {
        particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(config.particleCount * 3);
        const velocities = new Float32Array(config.particleCount * 3);
        const sizes = new Float32Array(config.particleCount);
        
        for (let i = 0; i < config.particleCount; i++) {
            // Random positions in 3D space
            positions[i * 3] = (Math.random() - 0.5) * 600;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
            
            // Random velocities
            velocities[i * 3] = (Math.random() - 0.5) * 0.5;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
            
            // Random sizes
            sizes[i] = Math.random() * 3 + 1;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Create particle material with custom shader
        particleMaterial = new THREE.PointsMaterial({
            color: config.colors.primary,
            size: 4,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);
    }
    
    // Create geometric shapes representing code/tech
    function createGeometricShapes() {
        const shapes = new THREE.Group();
        
        // Create floating code brackets
        const bracketGeometry = new THREE.TorusGeometry(15, 2, 8, 20, Math.PI);
        const bracketMaterial = new THREE.MeshBasicMaterial({
            color: config.colors.secondary,
            transparent: true,
            opacity: 0.6,
            wireframe: true
        });
        
        // Left bracket
        const leftBracket = new THREE.Mesh(bracketGeometry, bracketMaterial);
        leftBracket.position.set(-80, 20, 0);
        leftBracket.rotation.z = Math.PI;
        leftBracket.userData = { 
            rotationSpeed: { x: 0.005, y: 0.01, z: 0.003 },
            floatSpeed: 0.002,
            floatOffset: 0
        };
        shapes.add(leftBracket);
        
        // Right bracket
        const rightBracket = new THREE.Mesh(bracketGeometry, bracketMaterial);
        rightBracket.position.set(80, 20, 0);
        rightBracket.userData = { 
            rotationSpeed: { x: 0.005, y: -0.01, z: 0.003 },
            floatSpeed: 0.002,
            floatOffset: Math.PI
        };
        shapes.add(rightBracket);
        
        // Create floating cubes representing data/modules
        const cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
        const cubeMaterial = new THREE.MeshBasicMaterial({
            color: config.colors.accent,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        
        for (let i = 0; i < 5; i++) {
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.set(
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 150,
                (Math.random() - 0.5) * 100
            );
            cube.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            cube.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: 0.001 + Math.random() * 0.002,
                floatOffset: Math.random() * Math.PI * 2
            };
            shapes.add(cube);
        }
        
        // Create rings/orbits
        const ringGeometry = new THREE.RingGeometry(60, 65, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: config.colors.primary,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.userData = {
            rotationSpeed: { x: 0.002, y: 0.005, z: 0 }
        };
        shapes.add(ring);
        
        // Add second ring
        const ring2 = ring.clone();
        ring2.scale.set(1.5, 1.5, 1.5);
        ring2.rotation.x = Math.PI / 3;
        ring2.userData = {
            rotationSpeed: { x: -0.003, y: -0.004, z: 0.001 }
        };
        shapes.add(ring2);
        
        scene.add(shapes);
        
        // Store for animation
        scene.userData.shapes = shapes;
    }
    
    // Create floating text-like elements
    function createFloatingElements() {
        const elements = new THREE.Group();
        
        // Create glowing orbs representing MEAN stack
        const stackColors = [0x47A248, 0x000000, 0xDD0031, 0x339933]; // Mongo, Express, Angular, Node
        const stackNames = ['M', 'E', 'A', 'N'];
        
        for (let i = 0; i < 4; i++) {
            const orbGeometry = new THREE.SphereGeometry(12, 16, 16);
            const orbMaterial = new THREE.MeshBasicMaterial({
                color: config.colors.accent,
                transparent: true,
                opacity: 0.4
            });
            
            const orb = new THREE.Mesh(orbGeometry, orbMaterial);
            const angle = (i / 4) * Math.PI * 2;
            const radius = 100;
            
            orb.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius * 0.5,
                Math.sin(angle) * 30
            );
            
            orb.userData = {
                angle: angle,
                radius: radius,
                speed: 0.0005,
                yOffset: Math.sin(angle) * 20
            };
            
            elements.add(orb);
        }
        
        scene.add(elements);
        scene.userData.floatingElements = elements;
    }
    
    // Create ambient lighting
    function createAmbientLight() {
        const ambientLight = new THREE.AmbientLight(config.colors.accent, 0.5);
        scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(config.colors.primary, 1, 500);
        pointLight.position.set(100, 100, 100);
        scene.add(pointLight);
        
        const pointLight2 = new THREE.PointLight(config.colors.secondary, 0.8, 500);
        pointLight2.position.set(-100, -100, 50);
        scene.add(pointLight2);
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Mouse move
        if (!isTouchDevice) {
            document.addEventListener('mousemove', onMouseMove, { passive: true });
        }
        
        // Window resize
        window.addEventListener('resize', onResize, { passive: true });
        
        // Visibility change
        document.addEventListener('visibilitychange', onVisibilityChange);
    }
    
    // Mouse move handler
    function onMouseMove(event) {
        const rect = canvas.getBoundingClientRect();
        targetMouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        targetMouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
    
    // Resize handler
    function onResize() {
        if (!camera || !renderer) return;
        
        const width = canvas.parentElement.offsetWidth;
        const height = canvas.parentElement.offsetHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
    
    // Visibility change handler
    function onVisibilityChange() {
        isVisible = !document.hidden;
        if (isVisible) {
            animate();
        } else {
            cancelAnimationFrame(animationId);
        }
    }
    
    // Intersection Observer for performance
    function setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                    animate();
                } else {
                    cancelAnimationFrame(animationId);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(heroSection);
    }
    
    // Animation loop
    function animate() {
        if (!isVisible || prefersReducedMotion) return;
        
        animationId = requestAnimationFrame(animate);
        
        // Smooth mouse following
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
        
        // Rotate camera based on mouse
        camera.position.x += (mouseX * 30 - camera.position.x) * 0.02;
        camera.position.y += (mouseY * 20 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
        
        // Animate particles
        if (particles) {
            const positions = particleGeometry.attributes.position.array;
            const velocities = particleGeometry.attributes.velocity.array;
            
            for (let i = 0; i < config.particleCount; i++) {
                // Update positions
                positions[i * 3] += velocities[i * 3];
                positions[i * 3 + 1] += velocities[i * 3 + 1];
                positions[i * 3 + 2] += velocities[i * 3 + 2];
                
                // Boundary check - wrap around
                if (Math.abs(positions[i * 3]) > 300) velocities[i * 3] *= -1;
                if (Math.abs(positions[i * 3 + 1]) > 200) velocities[i * 3 + 1] *= -1;
                if (Math.abs(positions[i * 3 + 2]) > 100) velocities[i * 3 + 2] *= -1;
                
                // Mouse influence
                const dx = positions[i * 3] - mouseX * 100;
                const dy = positions[i * 3 + 1] - mouseY * 100;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < config.mouseInfluence) {
                    const force = (config.mouseInfluence - dist) / config.mouseInfluence;
                    velocities[i * 3] += (dx / dist) * force * 0.5;
                    velocities[i * 3 + 1] += (dy / dist) * force * 0.5;
                }
            }
            
            particleGeometry.attributes.position.needsUpdate = true;
            particles.rotation.y += config.rotationSpeed;
        }
        
        // Animate shapes
        if (scene.userData.shapes) {
            scene.userData.shapes.children.forEach(shape => {
                if (shape.userData.rotationSpeed) {
                    shape.rotation.x += shape.userData.rotationSpeed.x;
                    shape.rotation.y += shape.userData.rotationSpeed.y;
                    shape.rotation.z += shape.userData.rotationSpeed.z;
                }
                
                if (shape.userData.floatSpeed) {
                    shape.position.y += Math.sin(Date.now() * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.2;
                }
            });
        }
        
        // Animate floating elements
        if (scene.userData.floatingElements) {
            const time = Date.now() * 0.0005;
            scene.userData.floatingElements.children.forEach((orb, i) => {
                const data = orb.userData;
                data.angle += data.speed;
                
                orb.position.x = Math.cos(data.angle) * data.radius;
                orb.position.z = Math.sin(data.angle) * 30;
                orb.position.y = data.yOffset + Math.sin(time + i) * 10;
            });
            
            scene.userData.floatingElements.rotation.y += 0.001;
        }
        
        renderer.render(scene, camera);
    }
    
    // Create fallback visual for reduced motion or no WebGL
    // function createFallbackVisual() {
    //     const visual = document.querySelector('.hero-visual');
    //     if (!visual) return;
        
    //     visual.innerHTML = `
    //         <div class="hero-fallback">
    //             <div class="fallback-grid">
    //                 <div class="fallback-node"></div>
    //                 <div class="fallback-node"></div>
    //                 <div class="fallback-node"></div>
    //                 <div class="fallback-node"></div>
    //             </div>
    //             <div class="fallback-brackets">
    //                 <span class="bracket left">&lt;</span>
    //                 <span class="bracket right">/&gt;</span>
    //             </div>
    //             <div class="fallback-rings">
    //                 <div class="ring"></div>
    //                 <div class="ring"></div>
    //                 <div class="ring"></div>
    //             </div>
    //         </div>
    //     `;
        
    //     // Add fallback styles
    //     const style = document.createElement('style');
    //     style.textContent = `
    //         .hero-fallback {
    //             position: relative;
    //             width: 100%;
    //             height: 100%;
    //             display: flex;
    //             align-items: center;
    //             justify-content: center;
    //             overflow: hidden;
    //         }
            
    //         .fallback-grid {
    //             position: absolute;
    //             display: grid;
    //             grid-template-columns: repeat(2, 1fr);
    //             gap: 2rem;
    //             opacity: 0.3;
    //         }
            
    //         .fallback-node {
    //             width: 60px;
    //             height: 60px;
    //             border: 2px solid var(--accent-primary);
    //             border-radius: 12px;
    //             animation: float 4s ease-in-out infinite;
    //         }
            
    //         .fallback-node:nth-child(2) { animation-delay: 0.5s; }
    //         .fallback-node:nth-child(3) { animation-delay: 1s; }
    //         .fallback-node:nth-child(4) { animation-delay: 1.5s; }
            
    //         .fallback-brackets {
    //             position: relative;
    //             z-index: 2;
    //             font-family: var(--font-display);
    //             font-size: 8rem;
    //             font-weight: 700;
    //             color: var(--accent-primary);
    //             opacity: 0.6;
    //         }
            
    //         .bracket {
    //             display: inline-block;
    //             animation: pulse-glow 3s ease-in-out infinite;
    //         }
            
    //         .bracket.right { animation-delay: 0.5s; }
            
    //         .fallback-rings {
    //             position: absolute;
    //             width: 100%;
    //             height: 100%;
    //         }
            
    //         .ring {
    //             position: absolute;
    //             top: 50%;
    //             left: 50%;
    //             transform: translate(-50%, -50%);
    //             border: 1px solid var(--accent-primary);
    //             border-radius: 50%;
    //             opacity: 0.2;
    //             animation: expand 4s ease-out infinite;
    //         }
            
    //         .ring:nth-child(1) { width: 200px; height: 200px; }
    //         .ring:nth-child(2) { width: 300px; height: 300px; animation-delay: 1s; }
    //         .ring:nth-child(3) { width: 400px; height: 400px; animation-delay: 2s; }
            
    //         @keyframes pulse-glow {
    //             0%, 100% { opacity: 0.6; text-shadow: 0 0 20px var(--accent-glow); }
    //             50% { opacity: 1; text-shadow: 0 0 40px var(--accent-glow); }
    //         }
            
    //         @keyframes expand {
    //             0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.3; }
    //             100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
    //         }
    //     `;
    //     document.head.appendChild(style);
    // }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
})();