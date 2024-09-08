"use client"
import React, {useState} from 'react'
import {FormProvider, useForm} from "react-hook-form";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {GiPadlock} from "react-icons/gi";
import {Button} from "@nextui-org/react";
import {profileSchema, registerSchema, RegisterSchema} from "@/lib/schemas/registerSchema";
import UserDetailForm from "@/app/(auth)/register/UserDetailForm";
import {zodResolver} from "@hookform/resolvers/zod";
import ProfileForm from "@/app/(auth)/register/ProfileForm";
import {registerUser} from "@/app/actions/authActions";
import {handleFormServerError} from "@/lib/utils";
import {useRouter} from "next/navigation";

const stepSchemas = [registerSchema, profileSchema];

export default function RegisterForm() {
    const [activeStep, setActiveStep] = useState(0);
    const currentValidationSchema = stepSchemas[activeStep];
    const router = useRouter();

    const method = useForm<RegisterSchema>({
        resolver: zodResolver(currentValidationSchema),
        mode: "onTouched"
    });

    const {
        handleSubmit,
        getValues,
        setError,
        formState: {errors, isValid, isSubmitting}
    } = method

    const onSubmit = async () => {
        console.log(getValues());

        const result = await registerUser(getValues());

        if (result.status === "success") {
            router.push('/register/success');
        } else {
            handleFormServerError(result, setError);
        }
    }

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <UserDetailForm/>
            case 1:
                return <ProfileForm/>
            default:
                return 'Unknown step';
        }
    }

    const onBack = () => {
        setActiveStep(prev => prev - 1);
    }

    const onNext = async () => {
        if (activeStep === stepSchemas.length - 1) {
            await onSubmit();
        } else {
            setActiveStep(prev => prev + 1)
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
                <FormProvider {...method}>
                    <form onSubmit={handleSubmit(onNext)}>
                        <div className={"space-y-4"}>
                            {getStepContent(activeStep)}
                            {errors.root?.serverError && (
                                <p className={"text-danger text-sm"}>{errors.root.serverError.message}</p>
                            )}
                            <div className={'flex flex-row items-center gap-6'}>
                                {activeStep !== 0 && (
                                    <Button onClick={onBack} fullWidth={true}>
                                        Back
                                    </Button>
                                )}
                                <Button isLoading={isSubmitting} fullWidth color={"secondary"} type={"submit"}
                                        isDisabled={!isValid}>
                                    {activeStep === stepSchemas.length - 1 ? "Submit" : "Continue"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </FormProvider>

            </CardBody>
        </Card>
    )
}
