import { useEffect, useState, useRef } from 'react';

const CursorEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailingPosition, setTrailingPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);
  const animationRef = useRef<number | null>(null);

  // Add CSS to head
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Hide default cursor */
      body.cursor-effect-active,
      body.cursor-effect-active * {
        cursor: none !important;
      }
      
      /* Make sure cursor is visible over everything */
      .custom-cursor-core,
      .custom-cursor-aura,
      .custom-cursor-trail,
      .custom-cursor-constellation {
        position: fixed;
        pointer-events: none;
        z-index: 999999;
        transform: translate(-50%, -50%);
      }
      
      /* Core star - white dot */
      .custom-cursor-core {
        width: 8px;
        height: 8px;
        background: radial-gradient(circle at center, #FFFFFF 30%, rgba(255, 255, 255, 0.8) 100%);
        border-radius: 50%;
        box-shadow: 
          0 0 15px rgba(255, 255, 255, 0.9),
          0 0 30px rgba(165, 180, 252, 0.6),
          0 0 45px rgba(139, 92, 246, 0.3);
        filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.8));
        mix-blend-mode: screen;
        transition: width 0.3s ease, height 0.3s ease;
      }
      
      /* Aura effect - glowing orb */
      .custom-cursor-aura {
        width: 60px;
        height: 60px;
        background: radial-gradient(circle at center, 
          rgba(139, 92, 246, 0.2) 0%,
          rgba(99, 102, 241, 0.1) 30%,
          rgba(59, 130, 246, 0.05) 50%,
          transparent 70%
        );
        border-radius: 50%;
        border: 1px solid rgba(165, 180, 252, 0.3);
        transition: width 0.5s ease, height 0.5s ease, background 0.5s ease;
        animation: pulse-aura 4s ease-in-out infinite;
      }
      
      /* Trail - trailing circle */
      .custom-cursor-trail {
        width: 80px;
        height: 80px;
        background: radial-gradient(circle at center, 
          rgba(99, 102, 241, 0.15) 0%,
          rgba(139, 92, 246, 0.1) 40%,
          transparent 70%
        );
        border-radius: 50%;
        border: 1.5px solid rgba(165, 180, 252, 0.2);
        box-shadow: 
          inset 0 0 20px rgba(165, 180, 252, 0.1),
          0 0 30px rgba(99, 102, 241, 0.2);
        transition: width 0.8s ease, height 0.8s ease;
        animation: rotate-trail 20s linear infinite;
      }
      
      /* Constellation dots */
      .custom-cursor-constellation {
        width: 100px;
        height: 100px;
        pointer-events: none;
      }
      
      .constellation-dot {
        position: absolute;
        width: 3px;
        height: 3px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
        box-shadow: 0 0 6px rgba(165, 180, 252, 0.6);
        animation: twinkle 3s ease-in-out infinite;
      }
      
      /* INDIGO for buttons/links - matches your theme */
      .custom-cursor-aura.hover-clickable {
        background: radial-gradient(circle at center, 
          rgba(99, 102, 241, 0.3) 0%,
          rgba(79, 70, 229, 0.2) 30%,
          rgba(67, 56, 202, 0.1) 50%,
          transparent 70%
        );
        border-color: rgba(99, 102, 241, 0.5);
        animation-duration: 2s;
      }
      
      /* CYAN for interactive elements - matches cosmic theme */
      .custom-cursor-aura.hover-interactive {
        background: radial-gradient(circle at center, 
          rgba(34, 211, 238, 0.3) 0%,
          rgba(6, 182, 212, 0.2) 30%,
          rgba(8, 145, 178, 0.1) 50%,
          transparent 70%
        );
        border-color: rgba(34, 211, 238, 0.5);
        animation-duration: 1.5s;
      }
      
      /* EMERALD for submit buttons - matches your success/action theme */
      .custom-cursor-aura.hover-submit {
        background: radial-gradient(circle at center, 
          rgba(52, 211, 153, 0.3) 0%,
          rgba(16, 185, 129, 0.2) 30%,
          rgba(5, 150, 105, 0.1) 50%,
          transparent 70%
        );
        border-color: rgba(52, 211, 153, 0.5);
        animation-duration: 2s;
      }
      
      /* CORE CURSOR STATES - INDIGO for buttons/links */
      .custom-cursor-core.hover-clickable {
        width: 12px;
        height: 12px;
        background: radial-gradient(circle at center, #6366f1 30%, rgba(99, 102, 241, 0.8) 100%);
        box-shadow: 
          0 0 20px rgba(99, 102, 241, 0.9),
          0 0 40px rgba(79, 70, 229, 0.6),
          0 0 60px rgba(67, 56, 202, 0.3);
      }
      
      /* CYAN for interactive elements */
      .custom-cursor-core.hover-interactive {
        width: 12px;
        height: 12px;
        background: radial-gradient(circle at center, #22d3ee 30%, rgba(34, 211, 238, 0.8) 100%);
        box-shadow: 
          0 0 20px rgba(34, 211, 238, 0.9),
          0 0 40px rgba(6, 182, 212, 0.6),
          0 0 60px rgba(8, 145, 178, 0.3);
      }
      
      /* EMERALD for submit buttons */
      .custom-cursor-core.hover-submit {
        width: 12px;
        height: 12px;
        background: radial-gradient(circle at center, #34d399 30%, rgba(52, 211, 153, 0.8) 100%);
        box-shadow: 
          0 0 20px rgba(52, 211, 153, 0.9),
          0 0 40px rgba(16, 185, 129, 0.6),
          0 0 60px rgba(5, 150, 105, 0.3);
      }
      
      /* Animations */
      @keyframes pulse-aura {
        0%, 100% {
          opacity: 0.7;
          transform: translate(-50%, -50%) scale(1);
        }
        50% {
          opacity: 0.9;
          transform: translate(-50%, -50%) scale(1.05);
        }
      }
      
      @keyframes rotate-trail {
        from {
          transform: translate(-50%, -50%) rotate(0deg);
        }
        to {
          transform: translate(-50%, -50%) rotate(360deg);
        }
      }
      
      @keyframes twinkle {
        0%, 100% {
          opacity: 0.3;
          transform: scale(1);
        }
        50% {
          opacity: 1;
          transform: scale(1.2);
        }
      }
      
      /* Keep cursor visible on inputs */
      input, textarea, select {
        cursor: text !important;
      }
    `;
    document.head.appendChild(style);

    // Add class to body
    document.body.classList.add('cursor-effect-active');

    return () => {
      document.head.removeChild(style);
      document.body.classList.remove('cursor-effect-active');
    };
  }, []);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Detect hover elements
      const element = e.target as HTMLElement;
      
      // Check if element is a submit button (fixed the type property check)
      const isSubmitButton = element.tagName === 'BUTTON' && 
                            ((element as HTMLButtonElement).type === 'submit' || 
                             element.getAttribute('type') === 'submit' ||
                             element.classList.contains('submit') ||
                             element.textContent?.toLowerCase().includes('submit') ||
                             element.textContent?.toLowerCase().includes('save') ||
                             element.textContent?.toLowerCase().includes('continue'));
      
      // Check if element is clickable (buttons/links) - NOT submit buttons
      const isClickable = !isSubmitButton && (
        element.tagName === 'A' || 
        element.tagName === 'BUTTON' || 
        element.onclick !== null || 
        element.closest('a') !== null || 
        element.closest('button') !== null ||
        element.getAttribute('role') === 'button'
      );
      
      // Check if element is interactive (inputs, textareas, etc.)
      const isInteractive = element.tagName === 'INPUT' || 
                           element.tagName === 'TEXTAREA' || 
                           element.tagName === 'SELECT' ||
                           element.isContentEditable;
      
      setIsHoveringClickable(isClickable);
      setIsHoveringInteractive(isInteractive);
      setIsHoveringSubmit(isSubmitButton);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      // Increased delay factor for smoother, slower movement (0.08 instead of 0.15)
      setTrailingPosition(prev => ({
        x: prev.x + (position.x - prev.x) * 0.08,
        y: prev.y + (position.y - prev.y) * 0.08
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [position]);

  // Constellation dots positions (8 dots forming a star pattern)
  const constellationDots = [
    { x: 50, y: 50, delay: 0 },
    { x: 25, y: 25, delay: 0.2 },
    { x: 75, y: 25, delay: 0.4 },
    { x: 25, y: 75, delay: 0.6 },
    { x: 75, y: 75, delay: 0.8 },
    { x: 10, y: 50, delay: 1.0 },
    { x: 90, y: 50, delay: 1.2 },
    { x: 50, y: 10, delay: 1.4 },
    { x: 50, y: 90, delay: 1.6 }
  ];

  if (!isVisible) return null;

  return (
    <>
      {/* Trail - largest and slowest circle */}
      <div 
        className="custom-cursor-trail"
        style={{
          left: `${trailingPosition.x}px`,
          top: `${trailingPosition.y}px`,
        }}
      />
      
      {/* Aura effect - medium circle */}
      <div 
        className={`custom-cursor-aura ${isHoveringClickable ? 'hover-clickable' : ''} ${isHoveringInteractive ? 'hover-interactive' : ''} ${isHoveringSubmit ? 'hover-submit' : ''}`}
        style={{
          left: `${trailingPosition.x}px`,
          top: `${trailingPosition.y}px`,
        }}
      />
      
      {/* Constellation dots pattern */}
      <div 
        className="custom-cursor-constellation"
        style={{
          left: `${trailingPosition.x}px`,
          top: `${trailingPosition.y}px`,
        }}
      >
        {constellationDots.map((dot, index) => (
          <div
            key={index}
            className="constellation-dot"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              animationDelay: `${dot.delay}s`,
            }}
          />
        ))}
      </div>
      
      {/* Core star - follows cursor directly */}
      <div 
        className={`custom-cursor-core ${isHoveringClickable ? 'hover-clickable' : ''} ${isHoveringInteractive ? 'hover-interactive' : ''} ${isHoveringSubmit ? 'hover-submit' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </>
  );
};

export default CursorEffect;