type Props={
    title:string
};
export function PageTitle({title}:Props){
    return (
    <>
        <h1 className="text-center text-4xl font-bold">
            {title}
        </h1>
    </>     
    );
} 