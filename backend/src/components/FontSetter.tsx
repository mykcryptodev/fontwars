'use client';

import { useEffect } from 'react';

export default function FontSetter({ isComicWinning }: { isComicWinning: boolean }) {
  useEffect(() => {
    const setTheme = () => {
      document.body.style.fontFamily = isComicWinning ? "Comic Sans MS" : "Helvetica";
      
      // Set CSS variables for theme
      document.documentElement.style.setProperty('--ock-primary', isComicWinning ? '#f5f84c' : '#ffffff');
      document.documentElement.style.setProperty('--ock-primary-hover', isComicWinning ? '#f5f84c' : '#ffffff');
      document.documentElement.style.setProperty('--ock-primary-active', isComicWinning ? '#f5f84c' : '#ffffff');
      document.documentElement.style.setProperty('--ock-primary-washed', isComicWinning ? '#f5f84c' : '#ffffff');
      document.documentElement.style.setProperty('--ock-primary-disabled', isComicWinning ? '#f5f84c' : '#ffffff');
    };

    if (document.readyState === 'complete') {
      setTheme();
    } else {
      document.addEventListener('DOMContentLoaded', setTheme);
      return () => document.removeEventListener('DOMContentLoaded', setTheme);
    }
  }, [isComicWinning]);
  
  return null;
}