import React from 'react';
import { FC } from 'react'
import MainStep from './Wizard/Steps/MainStep';
import { SwapDataProvider } from '../context/swap';
import { AuthProvider } from '../context/authContext';
import { UserExchangeProvider } from '../context/userExchange';
import Wizard from './Wizard/Wizard';
import { BaseWizard, FormWizardSteps } from '../Models/Wizard';
import EmailStep from './Wizard/Steps/EmailStep';
import CodeStep from './Wizard/Steps/CodeStep';
import { FormWizardProvider, useFormWizardState } from '../context/formWizardProvider';
import APIKeyStep from './Wizard/Steps/APIKeyStep';
import AccountConnectStep from './Wizard/Steps/AccountConnectStep';
import { MenuProvider } from '../context/menu';
import IntroCard from './introCard';
import SwapConfirmationStep from './Wizard/Steps/SwapConfirmationStep';


const FormWizard: FormWizardSteps = {
  "SwapForm": { title: "Swap", content: MainStep, navigationDisabled: true, positionPercent: 0 },
  "Email": { title: "Email confirmation", content: EmailStep, dismissOnBack: true, positionPercent: 30 },
  "Code": { title: "Code", content: CodeStep, dismissOnBack: true, navigationDisabled: true, positionPercent: 35 },
  "ExchangeOAuth": { title: "OAuth flow", content: AccountConnectStep, dismissOnBack: true, positionPercent: 45 },
  "OffRampExchangeOAuth": { title: "OAuth flow", content: OfframpAccountConnectStep, dismissOnBack: true, positionPercent: 45 },
  "ExchangeApiCredentials": { title: "Please provide Read-only API keys", content: APIKeyStep, dismissOnBack: true, positionPercent: 50 },
  "SwapConfirmation": { title: "Swap confirmation", content: SwapConfirmationStep, positionPercent: 60 },
}


const Swap: FC = () => {

  return (
    <div>
      <div className="text-white">
        <AuthProvider>
          <MenuProvider>
            <SwapDataProvider >
              <UserExchangeProvider>
                <FormWizardProvider wizard={FormWizard} initialStep={"SwapForm"} initialLoading={true}>
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
                </FormWizardProvider >
              </UserExchangeProvider>
            </SwapDataProvider >
          </MenuProvider>
        </AuthProvider>
        <IntroCard />
      </div >
    </div >
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


export default Swap;