import React, { useRef } from "react";
import { gsap } from "gsap";

const Button = ({ children, onClick = () => {}, className = "" }) => {
    const boxRef = useRef(null);

    const handleClick = () => {
        if (boxRef.current) {
            gsap.to(boxRef.current, {
                duration: 0.3,
                y: -5,
                repeat: 1,
                ease: "power1.out",
            });
        }

        onClick?.();
    };

    return (
        <button 
            onClick={handleClick} 
            ref={boxRef} 
            className={`transition-transform duration-300 ease-in-out hover:-translate-y-1 focus:outline-none ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;