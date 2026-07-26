import { useState, useEffect } from 'react';

export function useScrollSpy(ids: string[]) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      // Check if user is at the bottom of the page
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        setActiveId(ids[ids.length - 1]);
        return;
      }

      // Check if user is near top of page (Hero section)
      if (window.scrollY < 200) {
        setActiveId('');
        return;
      }

      // Focal point: 35% down the viewport
      const viewportFocalPoint = window.scrollY + window.innerHeight * 0.35;

      let currentActiveId = '';
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (viewportFocalPoint >= top && viewportFocalPoint < top + height) {
            currentActiveId = id;
            break;
          }
        }
      }

      if (currentActiveId) {
        setActiveId(currentActiveId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ids]);

  return activeId;
}
