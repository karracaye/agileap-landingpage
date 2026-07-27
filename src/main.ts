import './style.css';
import { ThreeScene } from './three-scene';
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

    // 1. Render Main Tabs
    mainTabsContainer.innerHTML = `
      <button class="main-tab-btn ${activeMainTab === 'ap' ? 'active' : ''}" id="btn-tab-ap">Accounts Payable</button>
      <button class="main-tab-btn ${activeMainTab === 'ar' ? 'active' : ''}" id="btn-tab-ar">Account Receivables</button>
    `;

    document.getElementById('btn-tab-ap')?.addEventListener('click', () => {
      activeMainTab = 'ap';
      activeSubId = 'requisition';
      renderHighlights();
    });

    document.getElementById('btn-tab-ar')?.addEventListener('click', () => {
      activeMainTab = 'ar';
      activeSubId = 'invoices';
      renderHighlights();
    });

    // 2. Render Main description
    mainDescElement.textContent = activeMainTab === 'ap'
      ? "Effortlessly schedule payments and streamline your finances with automatic payments, eliminating the need for manual processing."
      : "Optimize billing timelines, send electronic invoices instantly, and accelerate payment collection via intelligent bank sync matching.";

    // 3. Render Timeline items
    timelineContainer.innerHTML = '';
    items.forEach((item) => {
      const isActive = item.id === activeSubId;
      const block = document.createElement('div');
      block.className = `sub-menu-item-block ${isActive ? 'active' : ''}`;
      
      const titleSpan = document.createElement('span');
      titleSpan.className = 'sub-menu-title';
      titleSpan.textContent = item.name;
      block.appendChild(titleSpan);

      if (isActive) {
        const descP = document.createElement('p');
        descP.className = 'sub-menu-desc';
        descP.textContent = item.description;
        block.appendChild(descP);
      }

      block.addEventListener('click', () => {
        activeSubId = item.id;
        renderHighlights();
      });

      timelineContainer.appendChild(block);
    });

    // 4. Render selected image
    cardsStackContainer.innerHTML = '';
    const activeItem = items[activeSubIndex] ?? items[0];
    if (activeItem) {
      const img = document.createElement('img');
      img.src = activeItem.imagePath;
      img.alt = activeItem.name;
      img.className = 'stacked-card-img';
      cardsStackContainer.appendChild(img);
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
      });

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

      const activeCard = document.querySelector(`.roadmap-node[data-mandate-stage="${stageId}"] .roadmap-card`);
      if (activeCard) {
        gsap.fromTo(activeCard, { opacity: 0.82 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
      }
    };

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
        '.mandate-copy > *',
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
        '.roadmap-node',
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#gst-mandate',
            start: 'top 68%',
            once: true
          }
        }
      );

      gsap.fromTo(
        '.mandate-insight, .mandate-visual-top',
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#gst-mandate',
            start: 'top 70%',
            once: true
          }
        }
      );

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
    }
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

    const usePinnedStory = window.matchMedia('(min-width: 1121px)').matches;

    if (usePinnedStory) {
      gsap.set('.adoption-copy', { opacity: 0, x: 64 });
      gsap.set('.adoption-benefit-card', { opacity: 0, y: 24, scale: 0.97 });
      gsap.set('.adoption-float-card', { opacity: 0, y: 26, scale: 0.9 });
      gsap.set('.adoption-orbit, .adoption-wave-lines', { opacity: 0, scale: 0.94 });
      gsap.set('.adoption-laptop', {
        opacity: 0,
        xPercent: 58,
        y: 16,
        scale: 1.14,
        rotateX: 5,
        transformOrigin: 'center center'
      });

      const adoptionStory = gsap.timeline({
        scrollTrigger: {
          trigger: '#adopt-invoicenow',
          start: 'top top',
          end: '+=125%',
          pin: true,
          scrub: 0.85,
          anticipatePin: 1
        }
      });

      adoptionStory
        .to('.adoption-laptop', {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.18,
          ease: 'power2.out'
        }, 0)
        .fromTo(
          '.adoption-bars span',
          { height: 0 },
          {
            height: (_, target) => (target as HTMLElement).style.getPropertyValue('--bar-height') || '50%',
            duration: 0.28,
            stagger: 0.025,
            ease: 'power3.out'
          },
          0.08
        )
        .to('.adoption-laptop', {
          xPercent: 0,
          scale: 1,
          duration: 0.46,
          ease: 'power2.inOut'
        }, 0.22)
        .to('.adoption-orbit, .adoption-wave-lines', {
          opacity: 0.72,
          scale: 1,
          duration: 0.3,
          stagger: 0.04,
          ease: 'power2.out'
        }, 0.32)
        .to('.adoption-float-card', {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.35,
          stagger: 0.05,
          ease: 'back.out(1.5)'
        }, 0.46)
        .to('.adoption-copy', {
          opacity: 1,
          x: 0,
          duration: 0.34,
          ease: 'power2.out'
        }, 0.58)
        .to('.adoption-benefit-card', {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.34,
          stagger: 0.045,
          ease: 'power2.out'
        }, 0.66);
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
            start: 'top 76%',
            once: true
          }
        }
      );

      gsap.fromTo(
        '.adoption-laptop',
        { opacity: 0, y: 40, rotateX: 4 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#adopt-invoicenow',
            start: 'top 70%',
            once: true
          }
        }
      );

      gsap.fromTo(
        '.adoption-float-card',
        { opacity: 0, y: 22, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: '#adopt-invoicenow',
            start: 'top 68%',
            once: true
          }
        }
      );

      gsap.fromTo(
        '.adoption-bars span',
        { height: 0 },
        {
          height: (_, target) => (target as HTMLElement).style.getPropertyValue('--bar-height') || '50%',
          duration: 0.9,
          stagger: 0.04,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#adopt-invoicenow',
            start: 'top 64%',
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
});
