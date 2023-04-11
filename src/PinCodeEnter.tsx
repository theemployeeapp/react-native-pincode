import delay from './delay'
import PinCode, { PinStatus } from './PinCode'
import { PinResultStatus, noBiometricsConfig } from './utils'
import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle
} from 'react-native'
import * as Keychain from 'react-native-keychain'
import TouchID from 'react-native-touch-id'
import React = require("react");

/**
 * Pin Code Enter PIN Page
 */

export interface IProps {
  alphabetCharsVisible?: boolean
  buttonDeleteComponent: any
  buttonDeleteText?: string
  buttonNumberComponent: any
  callbackErrorTouchId?: (e: Error) => void
  changeInternalStatus: (status: PinResultStatus) => void
  colorCircleButtons?: string
  colorPassword?: string
  colorPasswordEmpty?: string
  colorPasswordError?: string
  customBackSpaceIcon?: any
  disableLockScreen: boolean
  emptyColumnComponent: any
  endProcessFunction?: (pinCode: string) => void
  finishProcess?: (pinCode: string) => void
  getCurrentLength?: (length: number) => void
  handleResult: any
  iconButtonDeleteDisabled?: boolean
  maxAttempts: number
  numbersButtonOverlayColor?: string
  onFail?: any
  passwordComponent: any
  passwordLength?: number
  pinAttemptsAsyncStorageName: string
  pinCodeKeychainName: string
  pinCodeVisible?: boolean
  pinStatusExternal: PinResultStatus
  status: PinStatus
  storedPin: string | null
  styleAlphabet?: StyleProp<TextStyle>
  styleButtonCircle?: StyleProp<ViewStyle>
  styleCircleHiddenPassword?: StyleProp<ViewStyle>
  styleCircleSizeEmpty?: number
  styleCircleSizeFull?: number
  styleColorButtonTitle?: string
  styleColorButtonTitleSelected?: string
  styleColorSubtitle?: string
  styleColorSubtitleError?: string
  styleColorTitle?: string
  styleColorTitleError?: string
  styleColumnButtons?: StyleProp<ViewStyle>
  styleColumnDeleteButton?: StyleProp<ViewStyle>
  styleContainer?: StyleProp<ViewStyle>
  styleContainerPinCode?: StyleProp<ViewStyle>
  styleDeleteButtonColorHideUnderlay?: string
  styleDeleteButtonColorShowUnderlay?: string
  styleDeleteButtonIcon?: string
  styleDeleteButtonSize?: number
  styleDeleteButtonText?: StyleProp<TextStyle>
  styleEmptyColumn?: StyleProp<ViewStyle>
  stylePinCodeCircle?: StyleProp<ViewStyle>
  styleRowButtons?: StyleProp<ViewStyle>
  styleTextButton?: StyleProp<TextStyle>
  styleTextSubtitle?: StyleProp<TextStyle>
  styleTextTitle?: StyleProp<TextStyle>
  styleViewTitle?: StyleProp<ViewStyle>
  subtitle: string
  subtitleComponent: any
  subtitleError?: string
  textCancelButtonTouchID?: string
  textPasswordVisibleFamily?: string
  textPasswordVisibleSize?: number
  timePinLockedAsyncStorageName: string
  title: string
  titleAttemptFailed?: string
  titleComponent: any
  titleConfirmFailed?: string
  touchIDDisabled: boolean
  touchIDSentence: string
  touchIDTitle?: string
  passcodeFallback?: boolean
  vibrationEnabled?: boolean
  delayBetweenAttempts?: number
}

export interface IState {
  pinCodeStatus: PinResultStatus
  locked: boolean
}

function PinCodeEnter (props: IProps) {
  const [pinCodeStatus, setPinCodeStatus] = useState(PinResultStatus.initial)
  const [locked, setLocked] = useState(false)
  const [keyChainResult, setKeyChainResult] = useState(undefined)

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  useEffect(() => {
    if (!props.touchIDDisabled) triggerTouchID()
    if (!props.storedPin) {
      Keychain.getInternetCredentials(
        props.pinCodeKeychainName,
        noBiometricsConfig
      ).then(result => {
        setKeyChainResult(result && result.password || undefined)
      }).catch(error => {
        console.log('PinCodeEnter: ', error)
      })
    }
  }, [])

  useEffect(() => {
    const prevProps: Readonly<IProps> = usePrevious({ pinStatusExternal:  props.pinStatusExternal, touchIDDisabled: props.touchIDDisabled })
    if (prevProps && (prevProps.pinStatusExternal !== props.pinStatusExternal)) {
      setPinCodeStatus(props.pinStatusExternal)
    }
    if (prevProps && (prevProps.touchIDDisabled && !props.touchIDDisabled)) {
      triggerTouchID()
    }
  }, [props.pinStatusExternal, props.touchIDDisabled])

  const triggerTouchID = () => {
    !!TouchID && TouchID.isSupported()
      .then(() => {
        setTimeout(() => {
          launchTouchID()
        })
      })
      .catch((error: any) => {
        console.warn('TouchID error', error)
      })
  }

  const endProcess = async (pinCode?: string) => {
    if (!!props.endProcessFunction) {
      props.endProcessFunction(pinCode as string)
    } else {
      let pinValidOverride = undefined;
      if (props.handleResult) {
        pinValidOverride = await Promise.resolve(props.handleResult(pinCode));
      }
      setPinCodeStatus(PinResultStatus.initial)
      props.changeInternalStatus(PinResultStatus.initial)
      const pinAttemptsStr = await AsyncStorage.getItem(
        props.pinAttemptsAsyncStorageName
      )
      let pinAttempts = pinAttemptsStr ? +pinAttemptsStr : 0
      const pin = props.storedPin || keyChainResult
      if (pinValidOverride !== undefined ? pinValidOverride : pin === pinCode) {
        setPinCodeStatus(PinResultStatus.success)
        AsyncStorage.multiRemove([
          props.pinAttemptsAsyncStorageName,
          props.timePinLockedAsyncStorageName
        ])
        props.changeInternalStatus(PinResultStatus.success)
        if (!!props.finishProcess)
          props.finishProcess(pinCode as string)
      } else {
        pinAttempts++
        if (
          +pinAttempts >= props.maxAttempts &&
          !props.disableLockScreen
        ) {
          await AsyncStorage.setItem(
            props.timePinLockedAsyncStorageName,
            new Date().toISOString()
          )
          setPinCodeStatus(PinResultStatus.locked);
          setLocked(true);
          props.changeInternalStatus(PinResultStatus.locked)
        } else {
          await AsyncStorage.setItem(
            props.pinAttemptsAsyncStorageName,
            pinAttempts.toString()
          )
          setPinCodeStatus(PinResultStatus.failure);
          props.changeInternalStatus(PinResultStatus.failure)
        }
        if (props.onFail) {
          await delay(1500)
          props.onFail(pinAttempts)
        }
      }
    }
  }

  const  launchTouchID = async () => {
    const optionalConfigObject = {
      imageColor: '#e00606',
      imageErrorColor: '#ff0000',
      sensorDescription: 'Touch sensor',
      sensorErrorDescription: 'Failed',
      cancelText: props.textCancelButtonTouchID || 'Cancel',
      fallbackLabel: 'Show Passcode',
      unifiedErrors: false,
      passcodeFallback: props.passcodeFallback
    }
    try {
      await TouchID.authenticate(
        props.touchIDSentence,
        Object.assign({}, optionalConfigObject, {
          title: props.touchIDTitle
        })
      ).then((success: any) => {
        endProcess(props.storedPin || keyChainResult)
      })
    } catch (e) {
      if (!!props.callbackErrorTouchId) {
        props.callbackErrorTouchId(e)
      } else {
        console.log('TouchID error', e)
      }
    }
  }

  const pin =
    props.storedPin || keyChainResult
  return (
    <View
      style={[
        styles.container,
        props.styleContainer
      ]}>
      <PinCode
        alphabetCharsVisible={props.alphabetCharsVisible}
        buttonDeleteComponent={props.buttonDeleteComponent || null}
        buttonDeleteText={props.buttonDeleteText}
        buttonNumberComponent={props.buttonNumberComponent || null}
        colorCircleButtons={props.colorCircleButtons}
        colorPassword={props.colorPassword || undefined}
        colorPasswordEmpty={props.colorPasswordEmpty}
        colorPasswordError={props.colorPasswordError || undefined}
        customBackSpaceIcon={props.customBackSpaceIcon}
        emptyColumnComponent={props.emptyColumnComponent}
        endProcess={endProcess}
        launchTouchID={launchTouchID}
        getCurrentLength={props.getCurrentLength}
        iconButtonDeleteDisabled={props.iconButtonDeleteDisabled}
        numbersButtonOverlayColor={
          props.numbersButtonOverlayColor || undefined
        }
        passwordComponent={props.passwordComponent || null}
        passwordLength={props.passwordLength || 4}
        pinCodeStatus={pinCodeStatus}
        pinCodeVisible={props.pinCodeVisible}
        previousPin={pin}
        sentenceTitle={props.title}
        status={PinStatus.enter}
        styleAlphabet={props.styleAlphabet}
        styleButtonCircle={props.styleButtonCircle}
        styleCircleHiddenPassword={props.styleCircleHiddenPassword}
        styleCircleSizeEmpty={props.styleCircleSizeEmpty}
        styleCircleSizeFull={props.styleCircleSizeFull}
        styleColumnButtons={props.styleColumnButtons}
        styleColumnDeleteButton={props.styleColumnDeleteButton}
        styleColorButtonTitle={props.styleColorButtonTitle}
        styleColorButtonTitleSelected={
          props.styleColorButtonTitleSelected
        }
        styleColorSubtitle={props.styleColorSubtitle}
        styleColorSubtitleError={props.styleColorSubtitleError}
        styleColorTitle={props.styleColorTitle}
        styleColorTitleError={props.styleColorTitleError}
        styleContainer={props.styleContainerPinCode}
        styleDeleteButtonColorHideUnderlay={
          props.styleDeleteButtonColorHideUnderlay
        }
        styleDeleteButtonColorShowUnderlay={
          props.styleDeleteButtonColorShowUnderlay
        }
        styleDeleteButtonIcon={props.styleDeleteButtonIcon}
        styleDeleteButtonSize={props.styleDeleteButtonSize}
        styleDeleteButtonText={props.styleDeleteButtonText}
        styleEmptyColumn={props.styleEmptyColumn}
        stylePinCodeCircle={props.stylePinCodeCircle}
        styleRowButtons={props.styleRowButtons}
        styleTextButton={props.styleTextButton}
        styleTextSubtitle={props.styleTextSubtitle}
        styleTextTitle={props.styleTextTitle}
        styleViewTitle={props.styleViewTitle}
        subtitle={props.subtitle}
        subtitleComponent={props.subtitleComponent || null}
        subtitleError={props.subtitleError || 'Please try again'}
        textPasswordVisibleFamily={props.textPasswordVisibleFamily}
        textPasswordVisibleSize={props.textPasswordVisibleSize}
        titleAttemptFailed={
          props.titleAttemptFailed || 'Incorrect PIN Code'
        }
        titleComponent={props.titleComponent || null}
        titleConfirmFailed={
          props.titleConfirmFailed || 'Your entries did not match'
        }
        vibrationEnabled={props.vibrationEnabled}
        delayBetweenAttempts={props.delayBetweenAttempts}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default PinCodeEnter
