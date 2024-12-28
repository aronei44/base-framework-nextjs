import { ButtonProps } from "./types";

const colors = (color: ButtonProps['color']) => {
    switch (color) {
        case 'blue':
            return 'bg-blue-500 text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus:ring-blue-800';
        case 'red':
            return 'bg-red-500 text-white hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-500 dark:focus:ring-red-800';
        case 'green':
            return 'bg-green-500 text-white hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-500 dark:focus:ring-green-800';
        case 'yellow':
            return 'bg-yellow-500 text-white hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:bg-yellow-600 dark:hover:bg-yellow-500 dark:focus:ring-yellow-800';
        case 'gray':
            return 'bg-gray-500 text-white hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-800';
        case 'blue-outline':
            return 'border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:border-blue-600 dark:text-blue-600 dark:hover:bg-blue-600 dark:hover:text-white dark:focus:ring-blue-800';
        case 'red-outline':
            return 'border border-red-500 text-red-700 hover:bg-red-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 dark:border-red-600 dark:text-red-600 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-800';
        case 'green-outline':
            return 'border border-green-500 text-green-500 hover:bg-green-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 dark:border-green-600 dark:text-green-600 dark:hover:bg-green-600 dark:hover:text-white dark:focus:ring-green-800';
        case 'yellow-outline':
            return 'border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:border-yellow-600 dark:text-yellow-600 dark:hover:bg-yellow-600 dark:hover:text-white dark:focus:ring-yellow-800';
        case 'gray-outline':
            return 'border border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 dark:border-gray-600 dark:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800';
        default:
            return 'bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus:ring-blue-800';
    }
}

const Button = (props: ButtonProps) => {
    const className = `font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${colors(props.color)}`;

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