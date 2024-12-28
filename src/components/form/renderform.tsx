'use client';
import { useAlert } from "@/extras/alertcontext";
import Group from "./group";
import { FormBuilderProps, MetadataProps } from "./types";
import { useEffect, useCallback } from "react";
import { AllType } from "@/extras/types";

const RenderForm = (props: FormBuilderProps) => {

    const alert = useAlert();

    let unable = false;
    if (props.disabled !== undefined) {
        if (typeof props.disabled === 'boolean') {
            unable = props.disabled;
        } else {
            unable = props.disabled(props.mode);
        }
    }

    const SubmitForm = () => {
        let fields = props.fields
        if(props.onBeforeSubmit) {
            fields = props.onBeforeSubmit(props.fields)
        }
        if (Object.keys(fields.errors).length > 0) {
            let text = ''
            for (const key in fields.errors) {
                if (![undefined, null, ''].includes(fields.errors[key])) {
                    text += `${key}: ${fields.errors[key]}\n`
                }
            }
            alert.swal.fire({
                title: 'Error Validation',
                text: text,
                icon: 'error'
            })
            if (text !== '') return
        }
        alert.swal.fire({
            title: 'Success',
            text: 'Data has been submitted',
            icon: 'success'
        })
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
        <>
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
            {props.withButton && (
                <div>
                    <button
                        className="mt-5 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={SubmitForm}
                        disabled={unable}
                    >
                        Submit
                    </button>
                </div>
            )}
        </>
    )
}

export default RenderForm;