/*
  This screen is where the user goes if they 
  want to send a transaction of a particular coin. The goal is
  to give them easy access to all sending relating functions. 
  While this means the ability to enter an amount, an adress, and 
  send, it also means easy access to things like VerusPay. If given 
  the option, a user shouldn't have to always enter in a complicated 
  address to send to manually.
*/

import React, { Component } from "react"
import {
  View,
} from "react-native"
import { connect } from "react-redux";
import Styles from '../../../styles/index'
import { Button } from "react-native-paper"
import VerusPay from "../../VerusPay/VerusPay";
import Colors from "../../../globals/colors";
import { openConvertOrCrossChainSendModal, openSubwalletSendModal } from "../../../actions/actions/sendModal/dispatchers/sendModal";
import { IS_PBAAS, VRPC } from "../../../utils/constants/intervalConstants";

class SendCoin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const channel = this.props.subWallet.channel.split('.')[0]
    const allowConvertOrOffchain = this.props.activeCoin.tags.includes(IS_PBAAS) && channel === VRPC

    return (
      <View style={Styles.defaultRoot}>
        <VerusPay
          coinObj={this.props.activeCoin}
          channel={this.props.subWallet}
          acceptAddressOnly={true}
          containerStyle={{
            backgroundColor: Colors.primaryColor,
            width: "100%",
          }}
          navigation={this.props.navigation}
          maskProps={{
            height: 120,
            width: 150,
          }}
          button={() => (
            <View>
              <Button
                color={Colors.secondaryColor}
                mode={"contained"}
                onPress={() =>
                  openSubwalletSendModal(
                    this.props.activeCoin,
                    this.props.subWallet
                  )
                }
                style={{
                  marginBottom: allowConvertOrOffchain ? 8 : 24,
                }}
              >
                {"Enter manually"}
              </Button>
              {
                allowConvertOrOffchain && (
                  <Button
                    color={Colors.secondaryColor}
                    mode={'text'}
                    onPress={() =>
                      openConvertOrCrossChainSendModal(this.props.activeCoin, this.props.subWallet)
                    }
                    style={{
                      marginBottom: 8,
                    }}>
                    {'Convert or cross-chain'}
                  </Button>
                )
              }
            </View>
          )}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const chainTicker = state.coins.activeCoin.id
 
  return {
    activeCoin: state.coins.activeCoin,
    subWallet: state.coinMenus.activeSubWallets[chainTicker]
  };
};

export default connect(mapStateToProps)(SendCoin);