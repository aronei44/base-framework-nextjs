import { AllType } from "@/extras/types";
import { Dispatch, MouseEventHandler, SetStateAction } from "react";

export type DefaultFormProps = {
    name?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    error?: string;
    required?: boolean;
};

export type InputProps = {
    label?: string;
    placeholder?: string;
    type: 'text' | 'password' | 'date';
}

export type CheckboxProps = {
    label: string;
    checked: boolean;
}

export type RadioProps = {
    label: string;
    options: { label: string, value: string }[];
}

export type SwitchProps = {
    label: string;
    checked: boolean;
}

export type SelectProps = {
    label: string;
    options: { label: string, value: string }[];
}

export type SelectMultipleProps = {
    label: string;
    options: { label: string, value: string }[];
}

export type LabelProps = {
    label?: string;
    name?: string;
    required?: boolean;
};

export type MetadataProps = Array<DefaultFormBuilderProps & SwitchFormBuilderProps>

export type GroupProps = {
    cols: number;
    content: MetadataProps;
    title?: string;
    subtitle?: string;
    fields: Fields;
    setFields: (fields: Fields) => void;
    state: string;
    globalDisabled?: boolean;
};

export type TabProps = {
    cols: number;
    content: MetadataProps;
    title: string;
    subtitle?: string;
    onBeforeSwitchTab?: (fields: Fields) => boolean;
    fields: Fields;
    setFields: (fields: Fields) => void;
    state: string;
    globalDisabled?: boolean;
};

export type ButtonProps = {
    label: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    loading?: boolean;
    color?: 'blue' | 'red' | 'green' | 'yellow' | 'gray' | 'blue-outline' | 'red-outline' | 'green-outline' | 'yellow-outline' | 'gray-outline';
};

export type Fields = {
    data: Record<string, AllType>;
    errors: Record<string, string>;
}

export type ValidationOptions = {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: AllType) => string;
};

export type DefaultFormBuilderProps = {
    onChangeCallback?: (name: string, fields: Fields, setFields: (fields: Fields) => void) => void;
    disabled?: boolean | ((fields: Fields, state: string) => boolean);
    hidden?: boolean | ((fields: Fields, state: string) => boolean);
    validation?: (value: AllType, fields: Fields, validationFn: (value: AllType, options: ValidationOptions) => string) => string;
    name: string;
    required?: boolean;
    dataType: 'string' | 'number' | 'boolean' | 'array' | 'object';
};


export type SwitchFormBuilderProps = {
    type: 'text' | 'password' | 'date';
    setup: InputProps;
} | {
    type: 'checkbox';
    setup: CheckboxProps;
} | {
    type: 'radio';
    setup: RadioProps;
} | {
    type: 'switch';
    setup: SwitchProps;
} | {
    type: 'group';
    setup: GroupProps;
} | {
    type: 'tab';
    setup: TabProps;
} | {
    type: 'button';
    setup: ButtonProps;
} | {
    type: 'select';
    setup: SelectProps;
} | {
    type: 'select-multiple';
    setup: SelectMultipleProps;
};

type RenderElementAdditionalProps = {
    fields: Fields;
    setFields: Dispatch<SetStateAction<Fields>>;
    state: string;
    globalDisabled?: boolean;
}

export type RenderElementProps = DefaultFormBuilderProps & SwitchFormBuilderProps & RenderElementAdditionalProps;

export type FormBuilderProps = {
    menu_id: string;
    fields: Fields;
    setFields: Dispatch<SetStateAction<Fields>>;
    mode: string;
    disabled?: boolean | ((state: string) => boolean);
    cols: number;
    title?: string;
    subtitle?: string;
    onBeforeSubmit?: (fields: Fields) => Fields;
    content: MetadataProps;
    state: string;
};

export type MetadataBuilderProps = {
    fields: Fields;
    setFields: Dispatch<SetStateAction<Fields>>;
    disabled?: boolean | ((state: string) => boolean);
    cols: number;
    title?: string;
    subtitle?: string;
    onBeforeSubmit?: (fields: Fields) => Fields;
    content: MetadataProps;
}

export type MinimizeMetadaBuilderProps = {
    disabled?: boolean | ((state: string) => boolean);
    cols: number;
    title?: string;
    subtitle?: string;
    onBeforeSubmit?: (fields: Fields) => Fields;
    content: MetadataProps;
}