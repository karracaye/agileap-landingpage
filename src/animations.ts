import gsap from 'gsap';

export function initAnimations() {
  const splashEl = document.getElementById('agileap-intro-splash');
  const browserFrame = document.querySelector<HTMLElement>('.sincra-browser-frame');
  const heroCtas = document.querySelector<HTMLElement>('.sincra-hero-ctas');
  const mainHeader = document.getElementById('main-header');
  const topAdsBar = document.getElementById('top-ads-bar');
  const refreshBtn = document.querySelector<HTMLButtonElement>('.sincra-icon-btn[title="Refresh"]');

  if (!browserFrame) return;

  const triggerDashboardAssembly = () => {
    // Re-trigger CSS assembly animation for dashboard cards
    browserFrame.classList.remove('animate-dashboard-active');
    // Force reflow
    void browserFrame.offsetWidth;
    browserFrame.classList.add('animate-dashboard-active');
  };

  // Site Entry Sequence:
  // 1. AgileAP Logo Splash overlay in center of screen
  // 2. Splash screen fades out -> Entire group (Intro Badge + Dashboard) appears perfectly centered on screen
  // 3. Intro badge fades out & hides completely, main header & headline ("Automate Finance. Simplify Every Transaction.") slide in -> Dashboard moves down into hero bottom position
  // 4. Sequential 5-box assembly pop-in inside the dashboard
  if (splashEl) {
    const heroTitle = document.querySelector<HTMLElement>('.sincra-hero-title');
    const heroSub = document.querySelector<HTMLElement>('.sincra-hero-sub');
    const heroIntroBadge = document.getElementById('dashboard-intro-badge');
    const finalElements = [topAdsBar, mainHeader, heroTitle, heroSub, heroCtas].filter(Boolean);

    // Calculate combined Y offset so the ENTIRE group (Intro Badge + Dashboard) is centered in the viewport
    let initialYOffset = 0;
    if (heroIntroBadge) {
      const badgeRect = heroIntroBadge.getBoundingClientRect();
      const dashRect = browserFrame.getBoundingClientRect();
      const groupTop = badgeRect.top;
      const groupBottom = dashRect.bottom;
      const groupCenterY = (groupTop + groupBottom) / 2;
      const viewportCenterY = window.innerHeight / 2;
      initialYOffset = viewportCenterY - groupCenterY;
    } else {
      const dashRect = browserFrame.getBoundingClientRect();
      const dashCenterY = dashRect.top + dashRect.height / 2;
      initialYOffset = window.innerHeight / 2 - dashCenterY;
    }

    // Initial state: Final header & hero elements invisible and offset up
    gsap.set(finalElements, {
      opacity: 0,
      y: -40
    });

    // Intro badge starts invisible at exact group center offset
    if (heroIntroBadge) {
      gsap.set(heroIntroBadge, {
        opacity: 0,
        y: initialYOffset,
        scale: 0.95
      });
    }

    // Dashboard starts invisible at exact group center offset
    gsap.set(browserFrame, {
      opacity: 0,
      y: initialYOffset,
      scale: 0.94
    });

    // Step 1: Logo Splash overlay displays spinning icon -> full logo reveal (~1.85s) then fades out
    setTimeout(() => {
      splashEl.classList.add('splash-hidden');

      // Step 2: Reveal Intro Badge & Dashboard together in exact vertical middle of screen
      if (heroIntroBadge) {
        gsap.to(heroIntroBadge, {
          opacity: 1,
          y: initialYOffset,
          scale: 1,
          duration: 0.7,
          ease: 'power2.out'
        });
      }

      gsap.to(browserFrame, {
        opacity: 1,
        y: initialYOffset,
        scale: 1,
        duration: 0.75,
        ease: 'power2.out'
      });

      // Step 3: After showing centered intro badge & dashboard (~1850ms display):
      // Fade out and hide intro badge completely, reveal main header & hero headline above, and move dashboard down
      setTimeout(() => {
        // Fade out and hide intro badge completely
        if (heroIntroBadge) {
          gsap.to(heroIntroBadge, {
            opacity: 0,
            y: initialYOffset - 25,
            scale: 0.9,
            duration: 0.45,
            ease: 'power2.in',
            onComplete: () => {
              heroIntroBadge.style.display = 'none';
            }
          });
        }

        // Reveal Top Ads Bar, Main Header, Main Hero Title ("Automate Finance..."), Subtitle, and CTAs
        gsap.to(finalElements, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: 'power3.out'
        });

        // Move Dashboard down to natural layout position below hero headline
        gsap.to(browserFrame, {
          y: 0,
          duration: 0.95,
          ease: 'power3.inOut',
          onComplete: () => {
            // Step 4: Trigger 5-box assembly pop-in inside dashboard
            triggerDashboardAssembly();
          }
        });
      }, 1850);
    }, 1850);
  } else {
    triggerDashboardAssembly();
  }

  // Refresh Button Re-trigger Handler
  if (refreshBtn) {
    refreshBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const icon = refreshBtn.querySelector('iconify-icon, svg');
      if (icon) {
        gsap.fromTo(icon, { rotate: 0 }, { rotate: 360, duration: 0.6, ease: 'power2.inOut' });
      }
      triggerDashboardAssembly();
    });
  }
}

