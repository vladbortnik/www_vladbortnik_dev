  // Title Animation
  // Make the function global by attaching it to window
  window.initTitleAnimation = function() {
    const titleElement = document.getElementById('project-title');
    if (!titleElement) {
        console.error('Title element not found');
        return;
    }
  
    titleElement.classList.add('glitch-text');
  
    const style = document.createElement('style');
    style.textContent = `
        .glitch-text {
            position: relative;
            text-shadow: 0.05em 0 0 rgba(255,0,0,.75),
                        -0.025em -0.05em 0 rgba(0,255,0,.75),
                        0.025em 0.05em 0 rgba(0,0,255,.75);
        }
    `;
    document.head.appendChild(style);
  
    gsap.to("#project-title", {
        duration: 2,
        y: "-5px",
        textShadow: "0.05em 0 0 rgba(255,0,0,.35), -0.025em -0.05em 0 rgba(0,255,0,.35), 0.025em 0.05em 0 rgba(0,0,255,.35)",
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
    });
  };