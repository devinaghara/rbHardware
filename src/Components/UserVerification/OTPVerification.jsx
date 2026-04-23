import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * OTP verification is now handled inline within the SignUp component.
 * This component redirects users who navigate here directly to the signup page.
 */
const OTPVerification = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/signup', { replace: true });
    }, [navigate]);

    return null;
};

export default OTPVerification;