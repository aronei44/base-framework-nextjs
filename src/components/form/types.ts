import { MouseEventHandler } from "react";

export type DefaultFormProps = {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    required?: boolean;
    error?: string;
};

export type InputProps = {
    label?: string;
    placeholder?: string;
    type: 'text' | 'password' | 'date' | 'checkbox';
} & DefaultFormProps;

export type LabelProps = {
    label?: string;
    name?: string;
    required?: boolean;
};

export type ButtonProps = {
    label: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    loading?: boolean;
    color?: 'blue' | 'red' | 'green' | 'yellow' | 'gray';
};