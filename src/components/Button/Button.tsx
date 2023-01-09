import React from 'react';
import './Button.css';

interface ButtonProps {
    onClick: (event: React.MouseEvent) => void;
    children: React.ReactNode;
}

const Button = (props: ButtonProps) => {
    return (
        <button className="btn" {...props} />
    );
}

export default Button;
