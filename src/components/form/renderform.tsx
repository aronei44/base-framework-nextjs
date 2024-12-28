'use client';
import Group from "./group";
import { FormBuilderProps, MetadataProps } from "./types";
import { useEffect, useCallback } from "react";
import { AllType } from "@/extras/types";

const RenderForm = (props: FormBuilderProps) => {


    let unable = false;
    if (props.disabled !== undefined) {
        if (typeof props.disabled === 'boolean') {
            unable = props.disabled;
        } else {
            unable = props.disabled(props.mode);
        }
    }

    const contentToFields = (content: MetadataProps) => {
        const res: Record<string, AllType> = {}
        content.forEach((item) => {
            res[item.name] = ''
        })
        return res
    }

    const { setFields, fields } = props;

    const initiateFields = useCallback((content: MetadataProps) => {
        if (fields.data && Object.keys(fields.data).length > 0) return
        const newFields = contentToFields(content)
        setFields({
            data: {
                ...newFields,
                ...fields.data
            },
            errors: {}
        })
    }, [fields.data, setFields])

    useEffect(() => {
        initiateFields(props.content)
    }, [initiateFields, props.content])

    return (
        <Group
            cols={props.cols}
            content={props.content}
            fields={props.fields}
            setFields={props.setFields}
            state={props.mode}
            title={props.title}
            subtitle={props.subtitle}
            globalDisabled={unable}
        />
    )
}

export default RenderForm;