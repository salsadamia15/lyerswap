import Layout from '../components/layout'
import { AuthProvider } from '../context/authContext'
import { MenuProvider } from '../context/menu'
import { FormWizardProvider } from '../context/formWizardProvider'
import { AuthStep } from '../Models/Wizard'
import AuthWizard from '../components/Wizard/AuthWizard'
import { InferGetStaticPropsType } from 'next'
import LayerSwapAuthApiClient from '../lib/userAuthApiClient'

export default function AuthPage({ identityUrl }: InferGetStaticPropsType<typeof getStaticProps>) {
  LayerSwapAuthApiClient.identityBaseEndpoint = identityUrl

  return (
    <Layout>
      <AuthProvider>
        <MenuProvider>
          <FormWizardProvider initialStep={AuthStep.Email} initialLoading={false}>
            <AuthWizard />
          </FormWizardProvider >
        </MenuProvider>
      </AuthProvider>
    </Layout>
  )
}
export async function getStaticProps() {
  return {
    props: { identityUrl: 'https://identity-api-dev.layerswap.cloud' }
  }
}