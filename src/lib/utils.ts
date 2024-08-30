import {differenceInYears} from "date-fns";
import {FieldValues, Path, UseFormSetError} from "react-hook-form";
import {ZodIssue} from "zod";

export function calculateAge(dob: Date) {
    return differenceInYears(new Date(), dob);
}

export function handleFormServerError<TFieldValue extends FieldValues>(
    errorResponse: { error: string | ZodIssue[] },
    setError: UseFormSetError<TFieldValue>
) {
    if (Array.isArray(errorResponse.error)) {
        errorResponse.error.forEach((e) => {
            const fieldName = e.path.join('.') as Path<TFieldValue>;
            setError(fieldName, {message: e.message})
        })
    } else {
        setError('root.serverError', {message: errorResponse.error})
    }
}

export function transformImageUrl(imageUrl: string | null | undefined) {
    if (!imageUrl) return null;

    if (!imageUrl.includes('cloudinary')) return imageUrl;

    const uploadIndex = imageUrl.indexOf('/upload/') + '/upload/'.length;

    const transformation = 'c_fill,w_300,h_300,g_faces/';

    return `${imageUrl.slice(0, uploadIndex)}${transformation}${imageUrl.slice(uploadIndex)}`;
}
