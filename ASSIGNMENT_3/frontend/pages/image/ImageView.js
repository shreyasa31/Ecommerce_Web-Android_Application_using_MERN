
import { useRouter } from 'next/router';

export default function ImageView() {
    const router = useRouter();
    const { imageUrl } = router.query;

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
            {imageUrl && <img src={imageUrl} alt="Viewing Image" className="img-fluid mw-100 mh-100 h-auto" />}
        </div>
    );
}
