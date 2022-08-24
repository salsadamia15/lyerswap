import React from 'react';
import { FC } from 'react'
import { Transition } from '@headlessui/react';
import { FormWizardProvider, useFormWizardState } from '../../context/formWizardProvider';
import { BaseWizard, FormWizardSteps } from '../../Models/Wizard';
import Wizard from './Wizard';
import MainStep from './Steps/MainStep';
import AccountConnectStep from './Steps/AccountConnectStep';
import EmailStep from './Steps/EmailStep';
import OfframpAccountConnectStep from './Steps/OfframpAccountConnectStep';
import APIKeyStep from './Steps/APIKeyStep';
import SwapConfirmationStep from './Steps/SwapConfirmationStep';
import CodeStep from './Steps/CodeStep';


const CreateSwap: FC = () => {
    return (
        <Wizard>
            <WizardStep step='SwapForm'>
                <MainStep />
            </WizardStep>
            <WizardStep step='Email'>
                <EmailStep />
            </WizardStep>
            <WizardStep step='ExchangeOAuth'>
                <AccountConnectStep />
            </WizardStep>
            <WizardStep step='OffRampExchangeOAuth'>
                <OfframpAccountConnectStep />
            </WizardStep>
            <WizardStep step='ExchangeApiCredentials'>
                <APIKeyStep />
            </WizardStep>
            <WizardStep step='SwapConfirmation'>
                <SwapConfirmationStep />
            </WizardStep>
        </Wizard>
    )
};

type StepPorps = {
    step: string
}
const WizardStep: FC<StepPorps> = ({ step, children }) => {
    const { currentStep, moving, wrapperWidth } = useFormWizardState<BaseWizard>()

    return <Transition
        appear={false}
        unmount={false}
        show={step === currentStep}
        enter="transform transition ease-in-out duration-500"
        enterFrom={
            moving === "right"
                ? `translate-x-96 opacity-0`
                : `-translate-x-96 opacity-0`
        }
        enterTo={`translate-x-0 opacity-100`}
        leave="transform transition ease-in-out duration-500"
        leaveFrom={`translate-x-0 opacity-100`}
        leaveTo={
            moving === "right"
                ? `-translate-x-96 opacity-0`
                : `translate-x-96 opacity-0`
        }
        className={`${step === currentStep ? 'w-full' : 'w-0'} overflow-visible`}
        as="div"
    >
        <div
            style={{ width: `${wrapperWidth}px`, minHeight: '504px', height: '100%' }}>
            {children}
        </div>
    </Transition>
}


export default CreateSwap;