import { RefObject, useEffect, useRef } from 'react';

function useArrowConnect(elements: HTMLElement[]) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    ctx.current = canvas.getContext('2d');
    if (!ctx.current) return; // <-- Add a null check here

    const render = () => {
      ctx.current!.clearRect(0, 0, canvas.width, canvas.height);
      ctx.current!.beginPath();

      for (let i = 0; i < elements.length - 1; i++) {
        const elementA = elements[i];
        const elementB = elements[i + 1];

        const rectA = elementA.getBoundingClientRect();
        const rectB = elementB.getBoundingClientRect();

        const x1 = rectA.left + rectA.width / 2 - canvas.offsetLeft;
        const y1 = rectA.top + rectA.height / 2 - canvas.offsetTop;
        const x2 = rectB.left + rectB.width / 2 - canvas.offsetLeft;
        const y2 = rectB.top + rectB.height / 2 - canvas.offsetTop;

        ctx.current!.moveTo(x1, y1);
        ctx.current!.lineTo(x2, y2);
      }

      ctx.current!.stroke();
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [elements]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return; // <-- Add a null check here

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left - canvas.offsetLeft;
      const y = event.clientY - rect.top - canvas.offsetTop;

      ctx.current!.globalCompositeOperation = 'destination-out';
      ctx.current!.beginPath();
      ctx.current!.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.current!.fill();
      ctx.current!.globalCompositeOperation = 'source-over';
    };

    const canvas = canvasRef.current;
    if (!canvas) return; // <-- Add a null check here

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return canvasRef;
}


export default useArrowConnect