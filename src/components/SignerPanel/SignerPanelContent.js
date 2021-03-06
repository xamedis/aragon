import React from 'react'
import styled from 'styled-components'
import { Button, Info, RadioList, SafeLink } from '@aragon/ui'
import { network } from '../../demo-state'

const etherscanBaseUrl = `https://${
  network === 'mainnet' ? '' : `${network}.`
}etherscan.io`

const SignerPanelContent = ({
  error,
  intent,
  paths,
  onClose,
  onSign,
  web3,
}) => {
  if (!web3) {
    return <NeedWeb3Content intent={intent} onClose={onClose} />
  }

  const possible =
    (intent.tx || (Array.isArray(paths) && paths.length)) && !error
  return possible ? (
    <ActionPathsContent intent={intent} paths={paths} onSign={onSign} />
  ) : (
    <ImpossibleContent error={error} intent={intent} onClose={onClose} />
  )
}
SignerPanelContent.defaultProps = {
  intent: {},
  paths: [],
  onClose: () => {},
  onSign: () => {},
}

class ActionPathsContent extends React.Component {
  state = {
    selected: 0,
  }
  handleOnSelect = selected => {
    this.setState({ selected })
  }
  handleSign = () => {
    const { intent, paths, onSign } = this.props
    const { selected } = this.state
    onSign(intent.tx || paths[selected].tx)
  }
  render() {
    const { intent: { description, to, tx }, paths } = this.props
    const { selected } = this.state
    const radioItems = paths.map(({ appName, description }) => ({
      description,
      title: appName,
    }))
    const showPaths = !tx && paths.length
    return (
      <React.Fragment>
        {showPaths ? (
          <ActionContainer>
            <Info.Permissions title="Permission note:">
              You cannot directly perform this action. You do not have the
              necessary permissions.
            </Info.Permissions>
            <Actions>
              <RadioList
                title="Action Requirement"
                description={
                  paths.length > 1
                    ? 'Here are some options you can use to perform it:'
                    : 'You can perform this action through:'
                }
                items={radioItems}
                onChange={this.handleOnSelect}
                selected={selected}
              />
            </Actions>
          </ActionContainer>
        ) : (
          <DirectActionHeader>
            You can directly perform this action:
          </DirectActionHeader>
        )}
        <Info.Action icon={null} title="Action to be triggered">
          {`This transaction will ${
            showPaths ? 'eventually' : ''
          } ${description || 'perform an action on'}`}{' '}
          {to ? <AddressLink to={to} /> : 'this app'}.
        </Info.Action>
        <SignerButton onClick={this.handleSign}>Sign Transaction</SignerButton>
      </React.Fragment>
    )
  }
}

const ImpossibleContent = ({ error, intent: { description, to }, onClose }) => (
  <React.Fragment>
    <Info.Permissions title="Action impossible">
      You cannot {description || 'perform this action on'}{' '}
      {to ? <AddressLink to={to} /> : 'this app'}
      .{' '}
      {error
        ? 'An error occurred when we tried to find a path for this action.'
        : 'You do not have the necessary permissions.'}
    </Info.Permissions>
    <SignerButton onClick={onClose}>Close</SignerButton>
  </React.Fragment>
)

const NeedWeb3Content = ({ intent: { description, to }, onClose }) => (
  <React.Fragment>
    <Info.Action title="You can't perform any actions">
      {`You need to be connected to a Web3 instance in order to ${description ||
        'perform an action on'}`}{' '}
      {to ? <AddressLink to={to} /> : 'this app'}.
      <InstallMessage>
        Please install or enable{' '}
        <SafeLink href="https://metamask.io/" target="_blank">
          MetaMask
        </SafeLink>.
      </InstallMessage>
    </Info.Action>
    <SignerButton onClick={onClose}>Close</SignerButton>
  </React.Fragment>
)

const AddressLink = ({ to }) => (
  <SafeLink href={`${etherscanBaseUrl}/address/${to}`} target="_blank">
    {to}
  </SafeLink>
)

const ActionContainer = styled.div`
  margin-bottom: 40px;
`

const Actions = styled.div`
  margin-top: 25px;
`

const DirectActionHeader = styled.h2`
  margin-bottom: 10px;
`

const InstallMessage = styled.p`
  margin-top: 15px;
`

const SignerButton = styled(Button).attrs({
  mode: 'strong',
  wide: true,
})`
  margin-top: 20px;
`

export default SignerPanelContent
