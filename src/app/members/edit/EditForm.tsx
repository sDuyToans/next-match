"use client"
import React, {useEffect} from 'react'
import {Member} from "@prisma/client";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {memberEditSchema, MemberEditSchema} from "@/lib/schemas/memberEditSchema";
import {Button, Input} from "@nextui-org/react";
import {Textarea} from "@nextui-org/input";
import {updateMemberProfile} from "@/app/actions/userActions";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {handleFormServerError} from "@/lib/utils";

type Props = {
    member: Member
}

export default function EditForm({member}: Props) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: {isValid, isDirty, isSubmitting, errors}
    } = useForm<MemberEditSchema>({
        resolver: zodResolver(memberEditSchema),
        mode: 'onTouched'
    });

    useEffect(() => {
        if (member) {
            reset({
                name: member.name,
                description: member.description,
                city: member.city,
                country: member.country
            });
        }
    }, [member, reset])

    const onSubmit = async (data: MemberEditSchema) => {
        const nameUpdated = data.name !== member.name;
        const result = await updateMemberProfile(data, nameUpdated);

        if (result.status === 'success') {
            toast.success('Profile updated');
            router.refresh();
            reset({...data});
        } else {
            handleFormServerError(result, setError);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col space-y-4"}>
            <Input label={"Name"} variant={"bordered"} defaultValue={member.name} {...register("name")}
                   isInvalid={!!errors.name} errorMessage={errors.name?.message}/>
            <Textarea label={"Description"} variant={"bordered"}
                      defaultValue={member.description} {...register("description")}
                      isInvalid={!!errors.description} errorMessage={errors.description?.message} minRows={6}/>
            <div className={"flex flex-row gap-3"}>
                <Input label={"City"} variant={"bordered"} defaultValue={member.city} {...register("city")}
                       isInvalid={!!errors.city} errorMessage={errors.city?.message}/>
                <Input label={"Country"} variant={"bordered"} defaultValue={member.country} {...register("country")}
                       isInvalid={!!errors.country} errorMessage={errors.country?.message}/>
            </div>
            {errors.root?.serverError && (
                <p className={"text-danger text-sm"}>{errors.root.serverError.message}</p>
            )}
            <Button type={"submit"} className={"flex self-end"} variant={"solid"} disabled={!isValid || !isDirty}
                    isLoading={isSubmitting} color={"secondary"}>
                Update Profile
            </Button>
        </form>
    )
}
