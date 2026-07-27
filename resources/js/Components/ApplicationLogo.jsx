export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <img
            src="/images/logo.png"
            alt="Belia Hub"
            className={`object-contain ${className}`}
            {...props}
        />
    );
}
