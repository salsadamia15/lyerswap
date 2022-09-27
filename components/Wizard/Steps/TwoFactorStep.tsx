import { LockClosedIcon, MailOpenIcon } from '@heroicons/react/outline';
import { Form, Formik, FormikErrors, FormikProps } from 'formik';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { useSwapDataState, useSwapDataUpdate } from '../../../context/swap';
import { useFormWizardaUpdate } from '../../../context/formWizardProvider';
import { SwapCreateStep } from '../../../Models/Wizard';
import NumericInput from '../../Input/NumericInput';
import SubmitButton from '../../buttons/submitButton';
import Link from 'next/link';
import { ApiError, KnownwErrorCode } from '../../../Models/ApiError';

interface CodeFormValues {
    Code: string
}

//TODO email code is almost identical create reusable component for email and two factor code verification
const TwoFactorStep: FC = () => {
    const initialValues: CodeFormValues = { Code: '' }
    const { swapFormData, swap, codeRequested } = useSwapDataState()
    const { createAndProcessSwap } = useSwapDataUpdate()
    const router = useRouter();
    const { goToStep } = useFormWizardaUpdate<SwapCreateStep>()

    const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_COUNT)
    const [status, setStatus] = useState(STATUS.STOPPED)

    const secondsToDisplay = secondsRemaining % 60
    const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60
    const minutesToDisplay = minutesRemaining % 60
    const transferAmount = `${swapFormData?.amount} ${swapFormData?.currency?.name}`
    const minimalAuthorizeAmount = Math.round(swapFormData?.currency?.baseObject?.usd_price * Number(swapFormData?.amount) + 5)

    const formikRef = useRef<FormikProps<CodeFormValues>>(null);

    const handleStart = () => {
        setStatus(STATUS.STARTED)
    }
    const handleReset = () => {
        setStatus(STATUS.STOPPED)
        setSecondsRemaining(INITIAL_COUNT)
    }

    useInterval(
        () => {
            if (secondsRemaining > 0) {
                setSecondsRemaining(secondsRemaining - 1)
            } else {
                setStatus(STATUS.STOPPED)
            }
        },
        status === STATUS.STARTED ? 1000 : null)

    const handleSubmit = useCallback(async (values: CodeFormValues) => {
        handleReset();
        handleStart();
        try {
            const swapId = await createAndProcessSwap(values.Code);
            router.push(`/${swapId}`)
        }
        catch (error) {
            const data: ApiError = error?.response?.data?.error

            if (!data) {
                toast.error(error.message)
                return
            }

            if (data.code === KnownwErrorCode.COINBASE_AUTHORIZATION_LIMIT_EXCEEDED) {
                goToStep(SwapCreateStep.OAuth)
                toast.error(`You have not authorized minimum amount, for transfering ${transferAmount} please authirize at least ${minimalAuthorizeAmount}$`)
            }
            else if (data.code === KnownwErrorCode.COINBASE_INVALID_2FA) {
                goToStep(SwapCreateStep.TwoFactor)
                toast.error(`Invalid 2FA code`)
            }
            else if (data.code === KnownwErrorCode.INSUFFICIENT_FUNDS) {
                toast.error(`${swapFormData?.exchange?.name} error: You don't have that much.`)
            }
            else {
                toast.error(data.message)
            }
        }
    }, [swapFormData, swap, transferAmount])

    const handleResendTwoFACode = () => {
        handleReset()
        handleStart()
        formikRef.current.setFieldValue("Code", "");
    }

    useEffect(() => {
        if (codeRequested) {
            handleReset();
            handleStart();
        }
    }, [codeRequested])

    return (
        <>
            <Formik
                initialValues={initialValues}
                validateOnMount={true}
                validate={(values: CodeFormValues) => {
                    const errors: FormikErrors<CodeFormValues> = {};
                    if (!/^[0-9]*$/.test(values.Code)) {
                        errors.Code = "Value should be numeric";
                    }
                    else if (values.Code.length != 7) {
                        errors.Code = `The length should be 6 instead of ${values.Code.length}`;
                    }
                    return errors;
                }}
                onSubmit={handleSubmit}
            >
                {({ isValid, isSubmitting, errors, handleChange }) => (
                    <Form className='flex flex-col items-stretch min-h-[500px] text-primary-text'>
                        <div className="w-full px-6 md:px-8 pt-4 flex-col flex-1 flex">
                            <LockClosedIcon className='w-16 h-16 mt-auto text-primary self-center' />
                            <div className='text-center mt-5'>
                                <p className='mb-6 mt-2 pt-2 text-2xl font-bold text-white leading-6 text-center font-roboto'>
                                    {swapFormData?.exchange?.baseObject?.display_name} 2FA
                                </p>
                                <p className='text-center text-base px-2'>
                                    Please enter the 2 step verification code of your {swapFormData?.exchange?.baseObject?.display_name} account.
                                </p>
                            </div>
                            <div className="relative rounded-md shadow-sm mt-5">
                                <NumericInput
                                    pattern='^[0-9]*$'
                                    placeholder="XXXXXXX"
                                    maxLength={7}
                                    name='Code'
                                    onChange={e => {
                                        /^[0-9]*$/.test(e.target.value) && handleChange(e)
                                    }}
                                    className="leading-none h-12 text-2xl pl-5 text-white  focus:ring-primary text-center focus:border-primary border-darkblue-100 block
                                    placeholder:text-2xl placeholder:text-center tracking-widest placeholder:font-normal placeholder:opacity-50 bg-darkblue-600  w-full font-semibold rounded-md placeholder-gray-400"
                                />
                            </div>
                            <div className="mt-5">
                                {
                                    status == STATUS.STARTED ?
                                        <span className="flex items-center">
                                            Send again in
                                            <span className='ml-1'>
                                                {twoDigits(minutesToDisplay)}:
                                                {twoDigits(secondsToDisplay)}
                                            </span>
                                        </span>
                                        :
                                        <p className=" flex font-lighter leading-6 text-center">
                                            <span className="ml-1 font-lighter decoration underline-offset-1 underline hover:no-underline decoration-primary hover:cursor-pointer" onClick={handleResendTwoFACode}>
                                                Resend code
                                            </span>
                                        </p>
                                }
                            </div>
                            <div className='text-left mt-5 text-primary-text'>
                                <p className='text-sm'>To obtain the 2 step verification code, check:</p>
                                <ul className="list-disc font-light space-y-1 text-xs md:text-sm mt-2 ml-8">
                                    <li>your authenticator app (Google, Microsoft, or other), or</li>
                                    <li>text messages of the phone number associated with your Coinbase account</li>
                                </ul>
                            </div>

                            <div className="text-white text-sm mt-auto">
                                <p className='mb-5 text-primary-text'>

                                </p>
                                <SubmitButton type="submit" isDisabled={!isValid} icon="" isSubmitting={isSubmitting}>
                                    Confirm
                                </SubmitButton>
                            </div>
                        </div>
                    </Form >
                )}
            </Formik>
        </>
    )
}


function useInterval(callback, delay) {
    const savedCallback = useRef(undefined)

    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        function tick() {
            savedCallback.current()
        }
        if (delay !== null) {
            let id = setInterval(tick, delay)
            return () => clearInterval(id)
        }
    }, [delay])
}

const twoDigits = (num) => String(num).padStart(2, '0')
const STATUS = {
    STARTED: 'Started',
    STOPPED: 'Stopped',
}
const INITIAL_COUNT = 60

export default TwoFactorStep;