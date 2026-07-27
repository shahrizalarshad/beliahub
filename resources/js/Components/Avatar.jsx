// Gambar profil dengan fallback huruf pertama nama.
export default function Avatar({
    name = '',
    url = null,
    className = 'h-8 w-8 text-sm',
}) {
    if (url) {
        return (
            <img
                src={url}
                alt={name}
                className={`rounded-full object-cover ${className}`}
            />
        );
    }

    return (
        <span
            className={`flex items-center justify-center rounded-full bg-emerald-600 font-bold text-white ${className}`}
        >
            {name.charAt(0).toUpperCase()}
        </span>
    );
}
