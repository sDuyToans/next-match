"use client"
import React from 'react'
import {useForm} from "react-hook-form";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {GiPadlock} from "react-icons/gi";
import {Button, Input} from "@nextui-org/react";
import {RegisterSchema} from "@/lib/schemas/registerSchema";
import {registerUser} from "@/app/actions/authActions";
import {handleFormServerError} from "@/lib/utils";

export default function RegisterForm() {
    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isValid, isSubmitting}
    } = useForm<RegisterSchema>({
        // resolver: zodResolver(registerSchema),
        mode: "onTouched"
    });

    const onSubmit = async (data: RegisterSchema) => {
        const result = await registerUser(data);

        if (result.status === "success") {
            console.log("User registered successfully");
        } else {
            handleFormServerError(result, setError);
        }
    }

    return (
        <Card className={"w-2/5 mx-auto"}>
            <CardHeader className={"flex flex-col items-center justify-center"}>
                <div className={"flex flex-col gap-2 items-center text-secondary"}>
                    <div className={"flex flex-row items-center gap-3"}>
                        <GiPadlock size={30}/>
                        <h1 className={"text-3xl font-semibold"}>Register</h1>
                    </div>
                    <p className={"text-neutral-500"}>Welcome back to NextMatch</p>
                </div>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={"space-y-4"}>
                        <Input defaultValue={""} label={"Name"} variant={"bordered"} {...register("name")}
                               isInvalid={!!errors.name} errorMessage={errors.name?.message as string}/>
                        <Input defaultValue={""} label={"Email"}
                               variant={"bordered"} {...register("email")}
                               isInvalid={!!errors.email}
                               errorMessage={errors.email?.message as string}
                        />
                        <Input defaultValue={""} label={"Password"} variant={"bordered"}
                               type={"password"} {...register("password")}
                               isInvalid={!!errors.password}
                               errorMessage={errors.password?.message as string}/>
                        {errors.root?.serverError && (
                            <p className={"text-danger text-sm"}>{errors.root.serverError.message}</p>
                        )}
                        <Button isLoading={isSubmitting} fullWidth color={"secondary"} type={"submit"}
                                isDisabled={!isValid}>
                            Register
                        </Button>
                    </div>
                </form>
            </CardBody>
        </Card>
    )
}
