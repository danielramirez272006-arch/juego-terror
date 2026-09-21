import { useState, useEffect } from 'react';

export const toZalgo = (char) => {
  if (char === ' ') return char;
  const zalgoUp = ['\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', '\u0352', '\u0351', '\u030b', '\u030c'];
  const zalgoDown = ['\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u0320', '\u0324', '\u0325', '\u0326', '\u0329', '\u032a'];
  const zalgoMid = ['\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327', '\u0328', '\u0334', '\u0335', '\u0336'];
  let newChar = char;
  for (let k = 0; k < 2; k++) newChar += zalgoUp[Math.floor(Math.random() * zalgoUp.length)];
  for (let k = 0; k < 2; k++) newChar += zalgoDown[Math.floor(Math.random() * zalgoDown.length)];
  for (let k = 0; k < 2; k++) newChar += zalgoMid[Math.floor(Math.random() * zalgoMid.length)];
  return newChar;
};

export const useTypewriter = (text, speed = 30, corrupt = false) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    
    const interval = setInterval(() => {
      const char = text.charAt(i);
      setDisplayedText((prev) => prev + (corrupt && Math.random() > 0.5 ? toZalgo(char) : char));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, corrupt]);

  return { displayedText, isTyping };
};
