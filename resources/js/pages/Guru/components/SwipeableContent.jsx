import React, { useRef, useState, useEffect } from 'react';

/**
 * SwipeableContent - A carousel-like swipe component with circular navigation
 * Supports both touch (mobile) and mouse (desktop) events
 * When at the last item and swiping left: loops back to first item
 * When at the first item and swiping right: loops to last item
 */
function SwipeableContent({ currentIndex, totalItems, onIndexChange, children, className = '', loop = true }) {
    const containerRef = useRef(null);
    const [startX, setStartX] = useState(null);
    const [currentX, setCurrentX] = useState(null);
    const [dragOffset, setDragOffset] = useState(0);
    const [animationClass, setAnimationClass] = useState('');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const minSwipeDistance = 50;

    // Reset animation class after transition
    useEffect(() => {
        if (animationClass) {
            const timer = setTimeout(() => {
                setAnimationClass('');
                setIsTransitioning(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [animationClass, currentIndex]);

    // Handle start (touch or mouse)
    const handleStart = (clientX) => {
        if (isTransitioning) return;
        setStartX(clientX);
        setCurrentX(null);
        setIsDragging(true);
    };

    // Handle move (touch or mouse)
    const handleMove = (clientX) => {
        if (isTransitioning || startX === null || !isDragging) return;
        
        setCurrentX(clientX);
        
        let diff = clientX - startX;
        
        // Light resistance at edges when looping is enabled
        if (loop) {
            // Small resistance to indicate edge, but allow swipe
            if ((currentIndex === 0 && diff > 0) || (currentIndex === totalItems - 1 && diff < 0)) {
                diff = diff * 0.7;
            }
        } else {
            // Strong resistance when not looping
            if ((currentIndex === 0 && diff > 0) || (currentIndex === totalItems - 1 && diff < 0)) {
                diff = diff * 0.15;
            }
        }
        
        setDragOffset(diff);
    };

    // Handle end (touch or mouse)
    const handleEnd = () => {
        if (isTransitioning || !isDragging) return;
        
        setIsDragging(false);
        
        if (startX === null || currentX === null) {
            setDragOffset(0);
            setStartX(null);
            return;
        }
        
        const distance = startX - currentX;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe) {
            // Swipe left - go to next (or loop to first)
            setIsTransitioning(true);
            setAnimationClass('slide-out-left');
            setDragOffset(0);
            
            setTimeout(() => {
                if (currentIndex < totalItems - 1) {
                    onIndexChange(currentIndex + 1);
                } else if (loop) {
                    // Loop to first
                    onIndexChange(0);
                }
                setAnimationClass('slide-in-from-right');
            }, 150);
        } else if (isRightSwipe) {
            // Swipe right - go to previous (or loop to last)
            setIsTransitioning(true);
            setAnimationClass('slide-out-right');
            setDragOffset(0);
            
            setTimeout(() => {
                if (currentIndex > 0) {
                    onIndexChange(currentIndex - 1);
                } else if (loop) {
                    // Loop to last
                    onIndexChange(totalItems - 1);
                }
                setAnimationClass('slide-in-from-left');
            }, 150);
        } else {
            // Bounce back
            setDragOffset(0);
        }
        
        setStartX(null);
        setCurrentX(null);
    };

    // Touch event handlers
    const onTouchStart = (e) => handleStart(e.targetTouches[0].clientX);
    const onTouchMove = (e) => handleMove(e.targetTouches[0].clientX);
    const onTouchEnd = () => handleEnd();

    // Mouse event handlers (for desktop testing)
    const onMouseDown = (e) => {
        e.preventDefault();
        handleStart(e.clientX);
    };
    const onMouseMove = (e) => {
        if (isDragging) {
            e.preventDefault();
            handleMove(e.clientX);
        }
    };
    const onMouseUp = () => handleEnd();
    const onMouseLeave = () => {
        if (isDragging) handleEnd();
    };

    // Get inline styles for drag
    const getInlineStyles = () => {
        const isDraggingNow = startX !== null && !isTransitioning && isDragging;
        
        return {
            transform: isDraggingNow ? `translateX(${dragOffset}px)` : undefined,
            transition: isDraggingNow ? 'none' : 'transform 0.2s ease-out',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
        };
    };

    return (
        <>
            {/* CSS for animations */}
            <style>{`
                @keyframes slideOutLeft {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(-30%); opacity: 0; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(30%); opacity: 0; }
                }
                @keyframes slideInFromRight {
                    from { transform: translateX(30%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideInFromLeft {
                    from { transform: translateX(-30%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .slide-out-left {
                    animation: slideOutLeft 0.15s ease-out forwards;
                }
                .slide-out-right {
                    animation: slideOutRight 0.15s ease-out forwards;
                }
                .slide-in-from-right {
                    animation: slideInFromRight 0.2s ease-out forwards;
                }
                .slide-in-from-left {
                    animation: slideInFromLeft 0.2s ease-out forwards;
                }
            `}</style>
            
            <div
                ref={containerRef}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                className={`touch-pan-y ${animationClass} ${className}`}
                style={getInlineStyles()}
            >
                {children}
            </div>
        </>
    );
}

export default SwipeableContent;
