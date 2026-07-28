import './style.css';
import { ThreeScene } from './three-scene';
import { Benefits3D } from './benefits-3d';
import { initAnimations } from './animations';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector<HTMLCanvasElement>('#webgl-canvas');
  if (!canvas) {
    console.error('Could not find WebGL canvas element.');
    return;
  }

  // Initialize Three.js scene
  const threeScene = new ThreeScene(canvas);

  // Initialize Benefits Section 3D & Parallax Scene
  const benefitsCanvas = document.querySelector<HTMLCanvasElement>('#benefits-3d-canvas');
  if (benefitsCanvas) {
    new Benefits3D(benefitsCanvas);
  }

  // Initialize GSAP & ScrollTrigger Animations
  initAnimations(threeScene);

  // Interactive Highlights Section Setup
  const apItems = [
    {
      id: "requisition",
      name: "Purchase Requisition",
      description: "Optimised the creation, approval, and tracking of purchase requests, improving efficiency, reducing errors, ensuring compliance with procurement policies, and providing real-time visibility into spending.",
      imagePath: "/highlights/media__1785138276091.png"
    },
    {
      id: "order",
      name: "Purchase Order",
      description: "Automatically generate purchase orders from approved requisitions, manage vendor approvals, and track order status in real time.",
      imagePath: "/highlights/media__1785138038411.png"
    },
    {
      id: "receipt",
      name: "Goods Receipt",
      description: "Record delivery of goods, match items against purchase orders, and verify warehouse receiving notes to ensure delivery accuracy.",
      imagePath: "/highlights/media__1785138030897.png"
    },
    {
      id: "bills",
      name: "Bills",
      description: "Extract bills using AI OCR and capture incoming invoices via Peppol/InvoiceNow network automatically.",
      imagePath: "/highlights/media__1785138033416.png"
    },
    {
      id: "claims",
      name: "Claims",
      description: "Streamline employee expense claims, capture receipts on the go, and automate reimbursement approvals.",
      imagePath: "/highlights/media__1785138028070.png"
    },
    {
      id: "payment",
      name: "Payment",
      description: "Schedule bulk payments, execute FAST transfers, and reconcile payment transactions with bank ledgers automatically.",
      imagePath: "/highlights/media__1785138019990.png"
    },
    {
      id: "supply",
      name: "Supply Management",
      description: "Maintain centralized vendor profiles, track vendor performance metrics, and manage contract agreements.",
      imagePath: "/highlights/media__1785138289974.png"
    },
    {
      id: "reports",
      name: "Reports",
      description: "Generate rich AP reports, track spending patterns, and analyze cash flow projections dynamically.",
      imagePath: "/highlights/media__1785138282706.png"
    }
  ];

  const arItems = [
    {
      id: "invoices",
      name: "Invoices",
      description: "Create and dispatch professional e-invoices, automate recurring billing cycles, and track invoice statuses.",
      imagePath: "/highlights/media__1785138033416.png"
    },
    {
      id: "customers",
      name: "Customers",
      description: "Manage customer profiles, track outstanding balances, set credit limits, and invite them via Peppol.",
      imagePath: "/highlights/media__1785138289974.png"
    },
    {
      id: "collections",
      name: "Collections",
      description: "Automate follow-up reminders, trigger payment links, and send payment reminders automatically.",
      imagePath: "/highlights/media__1785138028070.png"
    },
    {
      id: "reconciliation",
      name: "Reconciliation",
      description: "Instantly match received payments against outstanding customer invoices using intelligent bank sync matching.",
      imagePath: "/highlights/media__1785138019990.png"
    }
  ];

  let activeMainTab: 'ap' | 'ar' = 'ap';
  let activeSubId = 'requisition';

  const mainTabsContainer = document.getElementById('highlights-main-tabs');
  const mainDescElement = document.getElementById('highlights-main-desc');
  const timelineContainer = document.getElementById('highlights-timeline-menu');
  const cardsStackContainer = document.getElementById('highlights-cards-stack');

  const renderHighlights = () => {
    if (!mainTabsContainer || !mainDescElement || !timelineContainer || !cardsStackContainer) return;

    const items = activeMainTab === 'ap' ? apItems : arItems;
    const activeSubIndex = items.findIndex(item => item.id === activeSubId);
    const activeItem = items[activeSubIndex >= 0 ? activeSubIndex : 0];

    // 1. Render Segmented Main Tabs
    mainTabsContainer.innerHTML = `
      <div class="highlights-pill-switcher">
        <button class="main-tab-btn ${activeMainTab === 'ap' ? 'active' : ''}" id="btn-tab-ap">
          <span class="tab-dot orange"></span> Accounts Payable
        </button>
        <button class="main-tab-btn ${activeMainTab === 'ar' ? 'active' : ''}" id="btn-tab-ar">
          <span class="tab-dot blue"></span> Accounts Receivables
        </button>
      </div>
    `;

    document.getElementById('btn-tab-ap')?.addEventListener('click', () => {
      if (activeMainTab !== 'ap') {
        activeMainTab = 'ap';
        activeSubId = 'requisition';
        renderHighlights();
      }
    });

    document.getElementById('btn-tab-ar')?.addEventListener('click', () => {
      if (activeMainTab !== 'ar') {
        activeMainTab = 'ar';
        activeSubId = 'invoices';
        renderHighlights();
      }
    });

    // 2. Render Main Description
    mainDescElement.textContent = activeMainTab === 'ap'
      ? "Effortlessly schedule payments and streamline your finances with automatic payments, eliminating manual processing."
      : "Optimize billing timelines, send electronic invoices instantly, and accelerate payment collection via intelligent bank sync matching.";

    // 3. Render Numbered Timeline Items
    timelineContainer.innerHTML = '';
    items.forEach((item, index) => {
      const isActive = item.id === activeSubId;
      const block = document.createElement('div');
      block.className = `sub-menu-item-block ${isActive ? 'active' : ''}`;
      
      const numStr = (index + 1).toString().padStart(2, '0');
      
      block.innerHTML = `
        <div class="sub-menu-header">
          <span class="sub-menu-num">${numStr}</span>
          <span class="sub-menu-title">${item.name}</span>
        </div>
        ${isActive ? `<p class="sub-menu-desc">${item.description}</p>` : ''}
      `;

      block.addEventListener('click', () => {
        if (activeSubId !== item.id) {
          activeSubId = item.id;
          renderHighlights();
        }
      });

      timelineContainer.appendChild(block);
    });

    // 4. Render Upgraded Window Screen Frame
    if (activeItem) {
      cardsStackContainer.innerHTML = `
        <div class="highlight-window-frame">
          <div class="window-topbar">
            <div class="window-title-badge">
              <span class="pulse-dot"></span>
              ${activeMainTab.toUpperCase()} Module: <strong>${activeItem.name}</strong>
            </div>
          </div>
          <div class="window-image-container">
            <img src="${activeItem.imagePath}" alt="${activeItem.name}" class="stacked-card-img" />
          </div>
        </div>
      `;

      // Smooth GSAP reveal transition
      const frameEl = cardsStackContainer.querySelector('.highlight-window-frame');
      if (frameEl) {
        gsap.fromTo(
          frameEl,
          { opacity: 0, y: 12, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' }
        );
      }
    }
  };

  // Initial render
  renderHighlights();

  type MandateStageId = '2025' | '2028' | '2031';

  const mandateStages: Record<MandateStageId, {
    progress: string;
    status: string;
    phaseLabel: string;
    kicker: string;
    title: string;
    copy: string;
  }> = {
    '2025': {
      progress: '0.2',
      status: 'Active phase: Nov 2025',
      phaseLabel: 'New GST registrants',
      kicker: 'First wave',
      title: 'New GST registration readiness',
      copy: 'Prepare invoice data, approval workflows, and Peppol-ready e-invoicing before registration volume grows.'
    },
    '2028': {
      progress: '0.68',
      status: 'Rollout window: 2028-2031',
      phaseLabel: 'Existing GST businesses',
      kicker: 'Progressive rollout',
      title: 'Implementation dates by notice',
      copy: 'Existing GST-registered businesses should be ready for phased onboarding as implementation dates are assigned.'
    },
    '2031': {
      progress: '1',
      status: 'Target state: 2031+',
      phaseLabel: 'InvoiceNow network',
      kicker: 'Network complete',
      title: 'All businesses onboarded',
      copy: 'Invoice workflows become network-first, reducing manual submissions and improving compliance visibility.'
    }
  };

  const initMandateRoadmap = () => {
    const visual = document.getElementById('mandate-visual');
    const status = document.getElementById('mandate-status');
    const phaseLabel = document.getElementById('mandate-phase-label');
    const kicker = document.getElementById('mandate-insight-kicker');
    const title = document.getElementById('mandate-insight-title');
    const copy = document.getElementById('mandate-insight-copy');
    const controls = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-mandate-stage]'));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!visual || controls.length === 0) return;

    let activeStage: MandateStageId = '2025';

    const setStage = (stageId: MandateStageId, animate = true) => {
      const stage = mandateStages[stageId];
      if (!stage) return;

      activeStage = stageId;
      visual.style.setProperty('--mandate-line-progress', stage.progress);

      controls.forEach((control) => {
        const isActive = control.dataset.mandateStage === stageId;
        control.classList.toggle('active', isActive);
        control.setAttribute('aria-pressed', String(isActive));
        const parentNode = control.closest('.roadmap-node-3d');
        if (parentNode) {
          parentNode.classList.toggle('active', isActive);
        }
      });

      // Animate SVG path dashoffset based on active stage
      const activePath = document.querySelector<SVGPathElement>('.roadmap-path-active');
      if (activePath) {
        const offsetMap: Record<MandateStageId, number> = { '2025': 650, '2028': 320, '2031': 0 };
        gsap.to(activePath, { strokeDashoffset: offsetMap[stageId], duration: 0.6, ease: 'power2.out' });
      }

      if (status) status.textContent = stage.status;
      if (phaseLabel) phaseLabel.textContent = stage.phaseLabel;
      if (kicker) kicker.textContent = stage.kicker;
      if (title) title.textContent = stage.title;
      if (copy) copy.textContent = stage.copy;

      if (!animate || prefersReducedMotion) return;

      gsap.fromTo(
        [kicker, title, copy].filter(Boolean),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out' }
      );
    };

    // 3D Stage Mouse Tilt Effect
    const stage3d = document.getElementById('roadmap-3d-stage');
    if (stage3d && !prefersReducedMotion) {
      stage3d.addEventListener('mousemove', (e) => {
        const rect = stage3d.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(stage3d, {
          rotateY: mouseX * 12,
          rotateX: -mouseY * 10,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
      stage3d.addEventListener('mouseleave', () => {
        gsap.to(stage3d, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'power2.out' });
      });
    }

    controls.forEach((control) => {
      control.addEventListener('click', () => {
        const stageId = control.dataset.mandateStage as MandateStageId | undefined;
        if (stageId && stageId !== activeStage) {
          setStage(stageId);
        }
      });
    });

    setStage(activeStage, false);

    if (!prefersReducedMotion) {
      gsap.fromTo(
        '.mandate-header-center > *',
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#gst-mandate',
            start: 'top 76%',
            once: true
          }
        }
      );

      gsap.fromTo(
        '#roadmap-3d-stage',
        { opacity: 0, y: 40, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#gst-mandate',
            start: 'top 70%',
            once: true
          }
        }
      );

      gsap.fromTo(
        '.roadmap-node-3d',
        { opacity: 0, y: 35, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: '#gst-mandate',
            start: 'top 65%',
            once: true
          }
        }
      );

      gsap.fromTo(
        '.mandate-insight-box',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#gst-mandate',
            start: 'top 60%',
            once: true
          }
        }
      );
    }

    const parallaxLayers = Array.from(document.querySelectorAll<HTMLElement>('[data-mandate-depth]'));

    visual.addEventListener('mousemove', (event) => {
      const rect = visual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      parallaxLayers.forEach((layer) => {
        const depth = Number(layer.dataset.mandateDepth || '0.1');
        gsap.to(layer, {
          x: x * 90 * depth,
          y: y * 70 * depth,
          rotateX: -y * 4 * depth,
          rotateY: x * 5 * depth,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    });

    visual.addEventListener('mouseleave', () => {
      parallaxLayers.forEach((layer) => {
        gsap.to(layer, {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 0.65,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    });
  };

  initMandateRoadmap();

  type AdoptionBenefitId = 'costs' | 'transition' | 'technical' | 'productivity';

  const adoptionBenefits: Record<AdoptionBenefitId, {
    chip: string;
    primary: string;
    secondary: string;
    rate: string;
    label: string;
    title: string;
    copy: string;
  }> = {
    costs: {
      chip: 'Cost readiness',
      primary: '$120,435',
      secondary: '1,248',
      rate: '96%',
      label: 'Current benefit focus',
      title: 'Lower Implementation Costs',
      copy: 'Avoid late-stage vendor rushes and keep implementation spend predictable.'
    },
    transition: {
      chip: 'Team onboarding',
      primary: '3 teams',
      secondary: '42 hrs',
      rate: '88%',
      label: 'Current benefit focus',
      title: 'Seamless Staff Transition',
      copy: 'Give staff time to adapt to new approval and e-invoicing workflows.'
    },
    technical: {
      chip: 'Integration health',
      primary: '7 checks',
      secondary: '0 gaps',
      rate: 'Ready',
      label: 'Current benefit focus',
      title: 'Tackle Technical Challenges Early',
      copy: 'Resolve system integrations and supplier readiness before checks begin.'
    },
    productivity: {
      chip: 'Productivity lift',
      primary: '18 hrs',
      secondary: '62%',
      rate: '2x',
      label: 'Current benefit focus',
      title: 'Instant Productivity Gains',
      copy: 'Reduce repetitive entry and shift finance teams toward higher-value work.'
    }
  };

  const initAdoptionBenefits = () => {
    const visual = document.getElementById('adoption-visual');
    const chip = document.getElementById('adoption-dashboard-chip');
    const primary = document.getElementById('adoption-kpi-primary');
    const secondary = document.getElementById('adoption-kpi-secondary');
    const rate = document.getElementById('adoption-kpi-rate');
    const label = document.getElementById('adoption-dashboard-label');
    const title = document.getElementById('adoption-dashboard-title');
    const copy = document.getElementById('adoption-dashboard-copy');
    const controls = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-adopt-benefit]'));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!visual || controls.length === 0) return;

    const setBenefit = (benefitId: AdoptionBenefitId, animate = true) => {
      const benefit = adoptionBenefits[benefitId];
      if (!benefit) return;

      controls.forEach((control) => {
        const isActive = control.dataset.adoptBenefit === benefitId;
        control.classList.toggle('active', isActive);
        control.setAttribute('aria-pressed', String(isActive));
      });

      if (chip) chip.textContent = benefit.chip;
      if (primary) primary.textContent = benefit.primary;
      if (secondary) secondary.textContent = benefit.secondary;
      if (rate) rate.textContent = benefit.rate;
      if (label) label.textContent = benefit.label;
      if (title) title.textContent = benefit.title;
      if (copy) copy.textContent = benefit.copy;

      if (!animate || prefersReducedMotion) return;

      gsap.fromTo(
        [chip, primary, secondary, rate, title, copy].filter(Boolean),
        { opacity: 0.55, y: 6 },
        { opacity: 1, y: 0, duration: 0.32, stagger: 0.025, ease: 'power2.out' }
      );
    };

    controls.forEach((control) => {
      const benefitId = control.dataset.adoptBenefit as AdoptionBenefitId | undefined;

      control.addEventListener('mouseenter', () => {
        if (benefitId) setBenefit(benefitId);
      });

      control.addEventListener('focus', () => {
        if (benefitId) setBenefit(benefitId);
      });

      control.addEventListener('click', () => {
        if (benefitId) setBenefit(benefitId);
      });
    });

    setBenefit('costs', false);

    if (prefersReducedMotion) return;

    const usePinnedStory = window.matchMedia('(min-width: 1024px)').matches;

    if (usePinnedStory) {
      gsap.set('.adoption-copy', { opacity: 0, x: 60 });
      gsap.set('.adoption-benefit-card', { opacity: 0, y: 24, scale: 0.96 });
      gsap.set('.adoption-float-card', { opacity: 0, y: 24, scale: 0.9 });
      
      // Step 1: Laptop base starts subtle while the graph/analytics screen is centered & BIGGER!
      gsap.set('.adoption-laptop-base', { opacity: 0, scaleY: 0.2 });
      gsap.set('.adoption-laptop', {
        opacity: 1,
        xPercent: 54, // Centered on screen at start!
        y: 10,
        scale: 1.35, // BIGGER & PROMINENT in the center!
        rotateX: 3,
        transformOrigin: 'center center'
      });

      const adoptionStory = gsap.timeline({
        scrollTrigger: {
          trigger: '#adopt-invoicenow',
          start: 'top top',
          end: '+=160%',
          pin: true,
          scrub: 0.65,
          anticipatePin: 1
        }
      });

      adoptionStory
        // ----------------------------------------------------
        // STEP 1: Graphs show up first in the center!
        // ----------------------------------------------------
        .fromTo(
          '.adoption-dashboard-main',
          { opacity: 0, y: 30, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: 'power2.out' },
          0
        )
        .fromTo(
          '.adoption-bars span',
          { height: 0 },
          {
            height: (_, target) => (target as HTMLElement).style.getPropertyValue('--bar-height') || '50%',
            duration: 0.26,
            stagger: 0.02,
            ease: 'power3.out'
          },
          0.06
        )

        // ----------------------------------------------------
        // STEP 2: Scroll again -> Laptop frame forms around graph in center!
        // ----------------------------------------------------
        .to('.adoption-laptop-base', {
          opacity: 1,
          scaleY: 1,
          duration: 0.24,
          ease: 'power2.out'
        }, 0.22)
        .to('.adoption-laptop', {
          rotateX: 0,
          duration: 0.2,
          ease: 'power1.out'
        }, 0.24)

        // ----------------------------------------------------
        // STEP 3: Scroll again -> Laptop scales down & glides to Left Side + Full Benefits reveal on right!
        // ----------------------------------------------------
        .to('.adoption-laptop', {
          xPercent: 0,
          y: 0,
          scale: 1, // Scales smoothly from 1.35 down to 1.0 on the left!
          duration: 0.44,
          ease: 'power2.inOut'
        }, 0.40)
        .to('.adoption-float-card', {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.32,
          stagger: 0.04,
          ease: 'back.out(1.5)'
        }, 0.62)
        .to('.adoption-copy', {
          opacity: 1,
          x: 0,
          duration: 0.34,
          ease: 'power2.out'
        }, 0.68)
        .to('.adoption-benefit-card', {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.34,
          stagger: 0.045,
          ease: 'power2.out'
        }, 0.74);
    } else {
      gsap.fromTo(
        '.adoption-copy > *',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#adopt-invoicenow',
            start: 'top 80%',
            once: true
          }
        }
      );

      gsap.fromTo(
        '.adoption-laptop',
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#adopt-invoicenow',
            start: 'top 80%',
            once: true
          }
        }
      );

      gsap.fromTo(
        '.adoption-float-card',
        { opacity: 0, y: 24, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: '#adopt-invoicenow',
            start: 'top 75%',
            once: true
          }
        }
      );
    }

    const parallaxLayers = Array.from(document.querySelectorAll<HTMLElement>('[data-adopt-depth]'));

    visual.addEventListener('mousemove', (event) => {
      const rect = visual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      parallaxLayers.forEach((layer) => {
        const depth = Number(layer.dataset.adoptDepth || '0.1');
        gsap.to(layer, {
          x: x * 84 * depth,
          y: y * 64 * depth,
          rotateX: -y * 5 * depth,
          rotateY: x * 6 * depth,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    });

    visual.addEventListener('mouseleave', () => {
      parallaxLayers.forEach((layer) => {
        gsap.to(layer, {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 0.65,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    });
  };

  initAdoptionBenefits();

  // Next-Gen Interactive Stage Showcase for 5 Ways InvoiceNow Benefits
  const initFiveBenefitsAnimation = () => {
    const section = document.getElementById('invoicenow-benefits');
    const selectorCards = Array.from(document.querySelectorAll<HTMLElement>('.feature-selector-card'));
    const displayTitle = document.getElementById('feature-display-title');
    const displayDesc = document.getElementById('feature-display-desc');
    const displayChips = document.getElementById('feature-display-chips');
    const displayImg = document.getElementById('feature-display-img') as HTMLImageElement | null;
    const displayBadge = document.getElementById('feature-display-badge');
    const displayFrame = document.querySelector<HTMLElement>('.display-screen-frame');

    if (!section || selectorCards.length === 0) return;

    const featureData = [
      {
        title: 'Reduced Manual Work',
        desc: 'Dramatically slashes time spent on repetitive manual data entry and invoice processing. Autonomous Peppol document recognition extracts and validates line items instantly into your ERP ledger.',
        chips: ['✓ Automated 3-Way Matching', '✓ Instant Discrepancy Alerts', '✓ Zero Manual Entry'],
        img: '/benefits/reduced-manual-work.jpg',
        badge: '⚡ 90% Time Saved'
      },
      {
        title: 'Simplified Invoicing',
        desc: 'Manage all invoicing data—including commercial business partners and government entities—through a single digital solution with centralized visibility and real-time tracking.',
        chips: ['✓ Single AR/AP Portal', '✓ Real-Time Status Tracking', '✓ Multi-Entity Support'],
        img: '/benefits/simplified-invoicing.jpg',
        badge: '✨ Unified Hub'
      },
      {
        title: 'Faster GST Processing',
        desc: 'Enjoy built-in system checks that reduce reporting errors, leading to significantly faster GST audits and accelerated tax refunds directly from IRAS.',
        chips: ['✓ IRAS Tax Code Validation', '✓ 3x Faster Audit Refund', '✓ Audit-Proof Trail'],
        img: '/benefits/faster-gst-processing.jpg',
        badge: '🛡️ IRAS Approved'
      },
      {
        title: 'Enterprise Data Security',
        desc: 'Enhanced reliability and enterprise security under the international Peppol network with AES-256 end-to-end encryption and ISO 27001 certification.',
        chips: ['✓ AES-256 Bit Encryption', '✓ ISO 27001 Certified', '✓ 99.99% Uptime SLA'],
        img: '/benefits/data-security.jpg',
        badge: '🔒 ISO 27001'
      },
      {
        title: 'Global Peppol Connectivity',
        desc: 'Seamlessly connect with thousands of international businesses across markets already on the Peppol network, including SG, AU, JP, NZ, and the European Union.',
        chips: ['✓ 40+ Peppol Countries', '✓ 500k+ Connected Vendors', '✓ Native BIS Billing 3.0'],
        img: '/benefits/global-connectivity.jpg',
        badge: '🌐 40+ Countries'
      }
    ];

    selectorCards.forEach((card) => {
      card.addEventListener('click', () => {
        const index = parseInt(card.getAttribute('data-feature-index') || '0', 10);
        const data = featureData[index];
        if (!data) return;

        selectorCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        if (displayFrame) {
          gsap.to(displayFrame, {
            opacity: 0.4,
            y: 8,
            duration: 0.15,
            onComplete: () => {
              if (displayTitle) displayTitle.textContent = data.title;
              if (displayDesc) displayDesc.textContent = data.desc;
              if (displayBadge) displayBadge.textContent = `✓ ${data.badge}`;
              if (displayImg) displayImg.src = data.img;
              if (displayChips) {
                displayChips.innerHTML = data.chips.map(c => `<span class="chip">${c}</span>`).join('');
              }

              gsap.to(displayFrame, {
                opacity: 1,
                y: 0,
                duration: 0.25,
                ease: 'power2.out'
              });
            }
          });
        }
      });
    });
  };

  initFiveBenefitsAnimation();

  // GSAP ScrollTrigger for Government Grants Section
  const initGovernmentFundingAnimation = () => {
    const section = document.getElementById('government-funding');
    const grantRows = Array.from(document.querySelectorAll<HTMLElement>('.grant-row-card'));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!section || grantRows.length === 0) return;

    if (!prefersReducedMotion) {
      // 1. Header Reveal
      gsap.fromTo(
        '.funding-header > *',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#government-funding',
            start: 'top 75%',
            once: true
          }
        }
      );

      // 2. Grant Rows Staggered Reveal
      gsap.fromTo(
        grantRows,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#government-funding',
            start: 'top 75%',
            once: true
          }
        }
      );
    }
  };

  initGovernmentFundingAnimation();

  // Mobile Menu Navigation Toggle
  const initMobileMenu = () => {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('main-nav');

    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  };

  initMobileMenu();

  // Top Ads Banner Handler
  const initTopAdsBar = () => {
    const topAdsBar = document.getElementById('top-ads-bar');
    const closeAdsBtn = document.getElementById('close-ads-btn');

    if (!topAdsBar) return;
    document.body.classList.add('has-ads-bar');

    if (closeAdsBtn) {
      closeAdsBtn.addEventListener('click', () => {
        topAdsBar.classList.add('dismissed');
        document.body.classList.remove('has-ads-bar');
      });
    }
  };

  initTopAdsBar();

  // Floating Ads Modal Card Handler
  const initFloatingAdsCard = () => {
    const card = document.getElementById('floating-ads-card');
    const closeBtn = document.getElementById('close-floating-ads-btn');

    if (!card) return;

    setTimeout(() => {
      card.classList.add('active');
    }, 1000);

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        card.classList.remove('active');
        card.classList.add('dismissed');
      });
    }
  };

  initFloatingAdsCard();

  // Scroll Down Indicator Fade Handler
  const initScrollDownIndicator = () => {
    const scrollBtn = document.getElementById('scroll-down-btn');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 180) {
        scrollBtn.classList.add('hidden-scroll');
      } else {
        scrollBtn.classList.remove('hidden-scroll');
      }
    });
  };

  initScrollDownIndicator();
});
