import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

@customElement("app-house-card")
export class HouseCard extends LitElement {
  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;
  private renderer!: THREE.WebGLRenderer;
  private model!: THREE.Group;
  private animationId!: number;
  private observer?: IntersectionObserver;
  private zoomValue = 2.2; // Zoom value

  @property({ type: String })
  title = "3D House Model";

  @property({ type: String })
  modelPath = "/house4.glb";

  @property({ type: Number })
  height = 400;

  @state()
  private isInView = false;

  @state()
  private isLoading = true;

  @state()
  private hasError = false;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: var(--model-height, 400px);
      position: relative;
      overflow: hidden;
      background: transparent;
    }

    .model-container {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      background: transparent;
    }

    .loading,
    .error {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: var(--font-size-lg);
      z-index: 1;
    }

    .error {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
      font-size: var(--font-size-base);
      text-align: center;
      padding: var(--space-4);
    }

    canvas {
      width: 100% !important;
      height: 100% !important;
      display: block;
      background: transparent !important;
    }

    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      :host {
        animation: none;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.setupIntersectionObserver();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  firstUpdated() {
    this.initThreeJS();
    this.loadModel();
  }

  private setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isInView = entry.isIntersecting;
        });
      },
      {
        threshold: 0.7,
        rootMargin: "0px 0px -20px 0px",
      }
    );

    this.updateComplete.then(() => {
      this.observer?.observe(this);
    });
  }

  private initThreeJS() {
    const container = this.shadowRoot?.querySelector(
      ".model-container"
    ) as HTMLElement;
    if (!container) return;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparent background

    // Orthographic Camera (isometric view)
    const aspect = container.clientWidth / container.clientHeight;
    const frustumSize = this.zoomValue;
    this.camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      1000
    );

    // Set camera to isometric position
    this.camera.position.set(1.2, 1.2, 1.2);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0x000000, 0); // Transparent background

    container.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Handle resize
    window.addEventListener("resize", () => this.onWindowResize());
  }

  private async loadModel() {
    const loader = new GLTFLoader();

    try {
      const gltf = await loader.loadAsync(this.modelPath);
      this.model = gltf.scene;

      // Scale and position the model
      this.model.scale.setScalar(1);
      this.model.position.set(0, 0, 0);

      // Apply theme-based shader material
      this.applyThemeShader();

      // Enable shadows
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.scene.add(this.model);
      this.isLoading = false;
      this.animateModel();
      this.requestUpdate();
    } catch (error) {
      console.error("Error loading 3D model:", error);
      this.isLoading = false;
      this.hasError = true;
      this.requestUpdate();
    }
  }

  private animateModel() {
    this.animationId = requestAnimationFrame(() => this.animateModel());

    // Slow constant rotation around Y-axis
    if (this.model) {
      this.model.rotation.y += 0.005; // Adjust speed as needed (0.005 is quite slow)
    }

    // Update shader time uniform for pulsing effect
    if (this.model) {
      const time = Date.now() * 0.001; // Convert to seconds
      this.model.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.ShaderMaterial
        ) {
          child.material.uniforms.time.value = time;
        }
      });
    }

    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize() {
    const container = this.shadowRoot?.querySelector(
      ".model-container"
    ) as HTMLElement;
    if (!container) return;

    const aspect = container.clientWidth / container.clientHeight;
    const frustumSize = this.zoomValue;
    this.camera.left = (-frustumSize * aspect) / 2;
    this.camera.right = (frustumSize * aspect) / 2;
    this.camera.top = frustumSize / 2;
    this.camera.bottom = -frustumSize / 2;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  private applyThemeShader() {
    if (!this.model) return;

    // Transparent fresnel shader for ghost-like appearance
    const fresnelMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        primaryColor: { value: new THREE.Color(0xff6b35) }, // --primary
        glowColor: { value: new THREE.Color(0xffa726) }, // --secondary for glow
        fresnelPower: { value: 2.0 },
        opacity: { value: 0.6 },
        glowIntensity: { value: 1.2 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        varying vec3 vViewDirection;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          // World position for fresnel calculation
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          
          // View direction for fresnel effect
          vViewDirection = normalize(cameraPosition - vWorldPosition);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 primaryColor;
        uniform vec3 glowColor;
        uniform float fresnelPower;
        uniform float opacity;
        uniform float glowIntensity;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        varying vec3 vViewDirection;
        
        void main() {
          // Calculate fresnel effect
          float fresnel = 1.0 - abs(dot(vNormal, vViewDirection));
          fresnel = pow(fresnel, fresnelPower);
          
          // Create height-based color gradient
          float heightFactor = (vPosition.y + 1.0) * 0.5;
          vec3 baseColor = mix(primaryColor, glowColor, heightFactor);
          
          // Add subtle pulsing effect
          float pulse = sin(time * 1.5) * 0.15 + 0.85;
          
          // Combine fresnel with base color
          vec3 finalColor = baseColor * (fresnel + 0.2) * pulse;
          
          // Add extra glow at edges
          float edgeGlow = pow(fresnel, 0.5) * glowIntensity;
          finalColor += glowColor * edgeGlow * 0.3;
          
          // Calculate final alpha with fresnel
          float alpha = (fresnel * 0.8 + 0.2) * opacity * pulse;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    // Apply the fresnel shader to all meshes
    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = fresnelMaterial;
      }
    });
  }

  render() {
    return html`
      <div class="model-container" style="--model-height: ${this.height}px">
        ${this.isLoading
          ? html` <div class="loading">Loading 3D Model...</div> `
          : ""}
        ${this.hasError
          ? html` <div class="error">Failed to load 3D model</div> `
          : ""}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-house-card": HouseCard;
  }
}
