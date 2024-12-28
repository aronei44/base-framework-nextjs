import { HeaderProps } from "./types";

const Header = (props: HeaderProps) => {
    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">{props.title}</h1>
                {props.rightComponent}
            </div>
            <hr className="mb-4" />
        </>
    )

}

export default Header;