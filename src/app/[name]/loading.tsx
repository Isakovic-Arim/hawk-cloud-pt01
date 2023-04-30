import Image from "next/image";


export default function Loading() {
    return <div className="w-full h-full flex justify-center items-center">
            <Image className="animate-spin mr-4" src={'/svgs/navigation/loading.svg'} width={40} height={40} alt="spinner"/>
            <p className="text-3xl">Loading...</p>
        </div>;
}