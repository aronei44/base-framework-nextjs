import { ButtonProps } from "./types";

const colors = (color: ButtonProps['color']) => {
    switch (color) {
        case 'blue':
            return 'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800';
        case 'red':
            return 'bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800';
        case 'green':
            return 'bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800';
        case 'yellow':
            return 'bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800';
        case 'gray':
            return 'bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800';
        default:
            return 'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800';
    }
}

const Button = (props: ButtonProps) => {
    const className = `text-white font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${colors(props.color)}`;

    return (
        <button 
            className={className}
            onClick={props.onClick}
            disabled={props.disabled}
            >
            {props.label}
        </button>
    )
}

export default Button;