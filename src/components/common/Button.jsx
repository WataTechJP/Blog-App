const Button = ({ children, onClick, className = "" }) => {
    return (
        <button onClick={onClick} className={`transition-transform duration-300 ease-in-out hover:-translate-y-1 ${className}`}>
            {children}
        </button>
    );
}

export default Button;