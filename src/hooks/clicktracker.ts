import { useEffect, useState } from 'react';
import useDragger from "./useDragger";
type ElementInfo = {
  id: string;
  tagName: string;
  classList?: string[];
};

function useClickTracker() {
  const [clickedElements, setClickedElements] = useState<ElementInfo[]>([]);
  const [duplicatedElementIds, setDuplicatedElementIds] = useState<string[]>([]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const clickedElement = event.target as HTMLElement;
      const clickedElementId = clickedElement.id;

      if (!clickedElementId || clickedElementId.includes('copy')) {
        return;
      }
      // useDragger(clickedElement.id)

      const isDuplicated = duplicatedElementIds.includes(clickedElementId);
      if (isDuplicated) {
        const duplicatedElement = document.getElementById(`${clickedElementId}-copy`);
        if (duplicatedElement) {
          duplicatedElement.remove();
        }

        setDuplicatedElementIds(prevDuplicatedIds =>
          prevDuplicatedIds.filter(id => id !== clickedElementId)
        );

        setClickedElements(prevClickedElements =>
          prevClickedElements.filter(element => element.id !== clickedElementId)
        );
      } else {
        const newElement = clickedElement.cloneNode(true) as HTMLElement;
        const newElementId = `${clickedElementId}-copy`;

        newElement.id = newElementId;
        setDuplicatedElementIds(prevDuplicatedIds => [...prevDuplicatedIds, clickedElementId]);
        let rightContainer = document.querySelector('.leftcontainer');
        if ( clickedElementId.includes('input')) {
          rightContainer = document.querySelector('.inputcontainer');
        }
        if ( clickedElementId.includes('CNN_LSTM')) {
          rightContainer = document.querySelector('.processingcontainer');
        }
        if ( clickedElementId.includes('output')) {
          rightContainer = document.querySelector('.outputcontainer');
        }
  
        //const rightContainer = document.querySelector('.inputcontainer');
        if (rightContainer) {
          rightContainer.appendChild(newElement);
        }

        const elementInfo: ElementInfo = {
          id: clickedElementId,
          tagName: newElement.tagName.toLowerCase(),
        };
        if (newElement.classList.length > 0) {
          elementInfo.classList = Array.from(newElement.classList);
        }
        setClickedElements(prevClickedElements => [...prevClickedElements, elementInfo]);

        // Handle dragging
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let initialX = 0;
        let initialY = 0;

        newElement.addEventListener('mousedown', (event: MouseEvent) => {
          isDragging = true;
          dragStartX = event.clientX;
          dragStartY = event.clientY;
          initialX = newElement.offsetLeft;
          initialY = newElement.offsetTop;
          newElement.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (event: MouseEvent) => {
          if (isDragging && newElement) {
            const deltaX = event.clientX - dragStartX;
            const deltaY = event.clientY - dragStartY;
            newElement.style.left = `${initialX + deltaX}px`;
            newElement.style.top = `${initialY + deltaY}px`;
          }
        });

        document.addEventListener('mouseup', () => {
          isDragging = false;
          if (newElement) {
            newElement.style.cursor = 'grab';
          }
        });
      }
    }

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [duplicatedElementIds]);

  return clickedElements;
}


export default useClickTracker
