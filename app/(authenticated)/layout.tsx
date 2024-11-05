import MainNav from "./main-nav";

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>

            <MainNav />
            <div className="mt-14">
                {children}
            </div>

        </>
    )
}