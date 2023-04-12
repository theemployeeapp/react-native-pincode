import ApplicationLocked from "./src/ApplicationLocked";
import { PinStatus } from "./src/PinCode";
import PinCodeChoose from "./src/PinCodeChoose";
import PinCodeEnter from "./src/PinCodeEnter";
import { hasPinCode, deletePinCode, resetInternalStates, PinResultStatus } from "./src/utils";
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";
import React = require("react");

export type IProps = {
  alphabetCharsVisible?: boolean
  bottomLeftComponent?: any
  buttonComponentLockedPage?: any
  buttonDeleteComponent?: any
  buttonDeleteText?: string
  buttonNumberComponent?: any
  callbackErrorTouchId?: (error: Error) => void
  colorCircleButtons?: string
  colorPassword?: string
  colorPasswordEmpty?: string
  colorPasswordError?: string
  customBackSpaceIcon?: any
  disableLockScreen?: boolean
  endProcessFunction?: (pinCode: string) => void
  finishProcess?: (pinCode?: string) => void
  getCurrentPinLength?: (length: number) => void
  handleResultEnterPin?: any
  iconComponentLockedPage?: any
  iconButtonDeleteDisabled?: boolean
  lockedIconComponent?: any
  lockedPage?: any
  maxAttempts?: number
  numbersButtonOverlayColor?: string
  onClickButtonLockedPage?: any
  onFail?: any
  passwordComponent?: any
  passwordLength?: number
  pinAttemptsAsyncStorageName?: string
  pinCodeKeychainName?: string
  pinCodeVisible?: boolean
  pinStatus?: PinResultStatus
  status: "choose" | "enter" | "locked"
  storedPin?: string
  storePin?: any
  styleAlphabet?: StyleProp<TextStyle>
  styleMainContainer?: StyleProp<ViewStyle>
  stylePinCodeChooseContainer?: StyleProp<ViewStyle>
  stylePinCodeEnterContainer?: StyleProp<ViewStyle>
  styleLockScreenButton?: StyleProp<ViewStyle>
  styleLockScreenColorIcon?: string
  styleLockScreenMainContainer?: StyleProp<ViewStyle>
  styleLockScreenNameIcon?: string
  styleLockScreenSizeIcon?: number
  styleLockScreenText?: StyleProp<TextStyle>
  styleLockScreenTextButton?: StyleProp<TextStyle>
  styleLockScreenTextTimer?: StyleProp<TextStyle>
  styleLockScreenTitle?: StyleProp<TextStyle>
  styleLockScreenViewCloseButton?: StyleProp<ViewStyle>
  styleLockScreenViewIcon?: StyleProp<ViewStyle>
  styleLockScreenViewTextLock?: StyleProp<ViewStyle>
  styleLockScreenViewTimer?: StyleProp<ViewStyle>
  stylePinCodeButtonCircle?: StyleProp<ViewStyle>
  stylePinCodeButtonNumber?: string
  stylePinCodeButtonNumberPressed?: string
  stylePinCodeCircle?: StyleProp<ViewStyle>
  stylePinCodeColorSubtitle?: string
  stylePinCodeColorSubtitleError?: string
  stylePinCodeColorTitle?: string
  stylePinCodeColorTitleError?: string
  stylePinCodeColumnButtons?: StyleProp<ViewStyle>
  stylePinCodeColumnDeleteButton?: StyleProp<ViewStyle>
  stylePinCodeDeleteButtonColorHideUnderlay?: string
  stylePinCodeDeleteButtonColorShowUnderlay?: string
  stylePinCodeDeleteButtonIcon?: string
  stylePinCodeDeleteButtonSize?: number
  stylePinCodeDeleteButtonText?: StyleProp<TextStyle>
  stylePinCodeEmptyColumn?: StyleProp<ViewStyle>
  stylePinCodeHiddenPasswordCircle?: StyleProp<ViewStyle>
  stylePinCodeHiddenPasswordSizeEmpty?: number
  stylePinCodeHiddenPasswordSizeFull?: number
  stylePinCodeMainContainer?: StyleProp<ViewStyle>
  stylePinCodeRowButtons?: StyleProp<ViewStyle>
  stylePinCodeTextButtonCircle?: StyleProp<TextStyle>
  stylePinCodeTextSubtitle?: StyleProp<TextStyle>
  stylePinCodeTextTitle?: StyleProp<TextStyle>
  stylePinCodeViewTitle?: StyleProp<TextStyle>
  subtitleChoose?: string
  subtitleComponent?: any
  subtitleConfirm?: string
  subtitleEnter?: string
  subtitleError?: string
  textButtonLockedPage?: string
  textCancelButtonTouchID?: string
  textDescriptionLockedPage?: string
  textSubDescriptionLockedPage?: string
  textPasswordVisibleFamily?: string
  textPasswordVisibleSize?: number
  textTitleLockedPage?: string
  timeLocked?: number
  timePinLockedAsyncStorageName?: string
  timerComponentLockedPage?: any
  titleAttemptFailed?: string
  titleChoose?: string
  titleComponent?: any
  titleComponentLockedPage?: any
  titleConfirm?: string
  titleConfirmFailed?: string
  titleEnter?: string
  titleValidationFailed?: string
  touchIDDisabled?: boolean
  touchIDSentence?: string
  touchIDTitle?: string
  validationRegex?: RegExp
  passcodeFallback?: boolean
  vibrationEnabled?: boolean
  delayBetweenAttempts?: number;
}

export type IState = {
  internalPinStatus: PinResultStatus
  pinLocked: boolean
}

const disableLockScreenDefault = false;
const timePinLockedAsyncStorageNameDefault = "timePinLockedRNPin";
const pinAttemptsAsyncStorageNameDefault = "pinAttemptsRNPin";
const pinCodeKeychainNameDefault = "reactNativePinCode";
const touchIDDisabledDefault = false;
const touchIDTitleDefault = 'Authentication Required';

function PINCode (props: IProps) {
  const [internalPinStatus, setInternalPinStatus] = useState(PinResultStatus.initial)
  const [pinLocked, setPinLocked] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem(props.timePinLockedAsyncStorageName || timePinLockedAsyncStorageNameDefault).then((val) => {
      setPinLocked(!!val);
    }).catch(error => {
      console.log('PINCode: ', error)
    })
  }, [])

  const changeInternalStatus = (status: PinResultStatus) => {
    if (status === PinResultStatus.initial) setPinLocked(false);
    setInternalPinStatus(status);
  };

  const renderLockedPage = () => {
    return (
      <ApplicationLocked
        buttonComponent={props.buttonComponentLockedPage || null}
        changeStatus={changeInternalStatus}
        colorIcon={props.styleLockScreenColorIcon}
        iconComponent={props.iconComponentLockedPage || null}
        lockedIconComponent={props.lockedIconComponent}
        nameIcon={props.styleLockScreenNameIcon}
        onClickButton={props.onClickButtonLockedPage || (() => {
          throw ("Quit application");
        })}
        pinAttemptsAsyncStorageName={props.pinAttemptsAsyncStorageName || pinAttemptsAsyncStorageNameDefault}
        sizeIcon={props.styleLockScreenSizeIcon}
        styleButton={props.styleLockScreenButton}
        styleMainContainer={props.styleLockScreenMainContainer}
        styleText={props.styleLockScreenText}
        styleTextButton={props.styleLockScreenTextButton}
        styleTextTimer={props.styleLockScreenTextTimer}
        styleTitle={props.styleLockScreenTitle}
        styleViewButton={props.styleLockScreenViewCloseButton}
        styleViewIcon={props.styleLockScreenViewIcon}
        styleViewTextLock={props.styleLockScreenViewTextLock}
        styleViewTimer={props.styleLockScreenViewTimer}
        textButton={props.textButtonLockedPage || "Quit"}
        textDescription={props.textDescriptionLockedPage || undefined}
        textSubDescription={props.textSubDescriptionLockedPage || undefined}
        textTitle={props.textTitleLockedPage || undefined}
        timePinLockedAsyncStorageName={props.timePinLockedAsyncStorageName || timePinLockedAsyncStorageNameDefault}
        timerComponent={props.timerComponentLockedPage || null}
        timeToLock={props.timeLocked || 300000}
        titleComponent={props.titleComponentLockedPage || undefined}
      />
    );
  };

  const { status, pinStatus, styleMainContainer } = props;
  return (
    <View style={[styles.container, styleMainContainer]}>
      {status === PinStatus.choose &&
        <PinCodeChoose
          alphabetCharsVisible={props.alphabetCharsVisible}
          buttonDeleteComponent={props.buttonDeleteComponent}
          buttonDeleteText={props.buttonDeleteText}
          buttonNumberComponent={props.buttonNumberComponent}
          colorCircleButtons={props.colorCircleButtons}
          colorPassword={props.colorPassword}
          colorPasswordEmpty={props.colorPasswordEmpty}
          colorPasswordError={props.colorPasswordError}
          customBackSpaceIcon={props.customBackSpaceIcon}
          emptyColumnComponent={props.bottomLeftComponent}
          finishProcess={props.finishProcess}
          getCurrentLength={props.getCurrentPinLength}
          iconButtonDeleteDisabled={props.iconButtonDeleteDisabled}
          numbersButtonOverlayColor={props.numbersButtonOverlayColor}
          passwordComponent={props.passwordComponent}
          passwordLength={props.passwordLength}
          pinCodeKeychainName={props.pinCodeKeychainName || pinCodeKeychainNameDefault}
          pinCodeVisible={props.pinCodeVisible}
          storePin={props.storePin || null}
          styleAlphabet={props.styleAlphabet}
          styleButtonCircle={props.stylePinCodeButtonCircle}
          styleCircleHiddenPassword={props.stylePinCodeHiddenPasswordCircle}
          styleCircleSizeEmpty={props.stylePinCodeHiddenPasswordSizeEmpty}
          styleCircleSizeFull={props.stylePinCodeHiddenPasswordSizeFull}
          styleColorButtonTitle={props.stylePinCodeButtonNumber}
          styleColorButtonTitleSelected={props.stylePinCodeButtonNumberPressed}
          styleColorSubtitle={props.stylePinCodeColorSubtitle}
          styleColorSubtitleError={props.stylePinCodeColorSubtitleError}
          styleColorTitle={props.stylePinCodeColorTitle}
          styleColorTitleError={props.stylePinCodeColorTitleError}
          styleColumnButtons={props.stylePinCodeColumnButtons}
          styleColumnDeleteButton={props.stylePinCodeColumnDeleteButton}
          styleContainer={props.stylePinCodeChooseContainer}
          styleContainerPinCode={props.stylePinCodeMainContainer}
          styleDeleteButtonColorHideUnderlay={props.stylePinCodeDeleteButtonColorHideUnderlay}
          styleDeleteButtonColorShowUnderlay={props.stylePinCodeDeleteButtonColorShowUnderlay}
          styleDeleteButtonIcon={props.stylePinCodeDeleteButtonIcon}
          styleDeleteButtonSize={props.stylePinCodeDeleteButtonSize}
          styleDeleteButtonText={props.stylePinCodeDeleteButtonText}
          styleEmptyColumn={props.stylePinCodeEmptyColumn}
          stylePinCodeCircle={props.stylePinCodeCircle}
          styleRowButtons={props.stylePinCodeRowButtons}
          styleTextButton={props.stylePinCodeTextButtonCircle}
          styleTextSubtitle={props.stylePinCodeTextSubtitle}
          styleTextTitle={props.stylePinCodeTextTitle}
          styleViewTitle={props.stylePinCodeViewTitle}
          subtitleChoose={props.subtitleChoose || "to keep your information secure"}
          subtitleComponent={props.subtitleComponent}
          subtitleConfirm={props.subtitleConfirm || ""}
          subtitleError={props.subtitleError}
          textPasswordVisibleFamily={props.textPasswordVisibleFamily}
          textPasswordVisibleSize={props.textPasswordVisibleSize}
          titleAttemptFailed={props.titleAttemptFailed}
          titleChoose={props.titleChoose || "1 - Enter a PIN Code"}
          titleComponent={props.titleComponent}
          titleConfirm={props.titleConfirm || "2 - Confirm your PIN Code"}
          titleConfirmFailed={props.titleConfirmFailed}
          titleValidationFailed={props.titleValidationFailed}
          validationRegex={props.validationRegex}
          vibrationEnabled={props.vibrationEnabled}
          delayBetweenAttempts={props.delayBetweenAttempts}
        />}
      {status === PinStatus.enter &&
        <PinCodeEnter
          alphabetCharsVisible={props.alphabetCharsVisible}
          passcodeFallback={props.passcodeFallback}
          buttonDeleteComponent={props.buttonDeleteComponent}
          buttonDeleteText={props.buttonDeleteText}
          buttonNumberComponent={props.buttonNumberComponent}
          callbackErrorTouchId={props.callbackErrorTouchId}
          changeInternalStatus={changeInternalStatus}
          colorCircleButtons={props.colorCircleButtons}
          colorPassword={props.colorPassword}
          colorPasswordEmpty={props.colorPasswordEmpty}
          colorPasswordError={props.colorPasswordError}
          customBackSpaceIcon={props.customBackSpaceIcon}
          disableLockScreen={props.disableLockScreen || disableLockScreenDefault}
          emptyColumnComponent={props.bottomLeftComponent}
          endProcessFunction={props.endProcessFunction}
          finishProcess={props.finishProcess}
          getCurrentLength={props.getCurrentPinLength}
          handleResult={props.handleResultEnterPin || null}
          iconButtonDeleteDisabled={props.iconButtonDeleteDisabled}
          maxAttempts={props.maxAttempts || 3}
          numbersButtonOverlayColor={props.numbersButtonOverlayColor}
          onFail={props.onFail || null}
          passwordComponent={props.passwordComponent}
          passwordLength={props.passwordLength}
          pinAttemptsAsyncStorageName={props.pinAttemptsAsyncStorageName || pinAttemptsAsyncStorageNameDefault}
          pinCodeKeychainName={props.pinCodeKeychainName || pinCodeKeychainNameDefault}
          pinCodeVisible={props.pinCodeVisible}
          pinStatusExternal={props.pinStatus || PinResultStatus.initial}
          status={PinStatus.enter}
          storedPin={props.storedPin || null}
          styleAlphabet={props.styleAlphabet}
          styleButtonCircle={props.stylePinCodeButtonCircle}
          styleCircleHiddenPassword={props.stylePinCodeHiddenPasswordCircle}
          styleCircleSizeEmpty={props.stylePinCodeHiddenPasswordSizeEmpty}
          styleCircleSizeFull={props.stylePinCodeHiddenPasswordSizeFull}
          styleColorButtonTitle={props.stylePinCodeButtonNumber}
          styleColorButtonTitleSelected={props.stylePinCodeButtonNumberPressed}
          styleColorSubtitle={props.stylePinCodeColorSubtitle}
          styleColorSubtitleError={props.stylePinCodeColorSubtitleError}
          styleColorTitle={props.stylePinCodeColorTitle}
          styleColorTitleError={props.stylePinCodeColorTitleError}
          styleColumnButtons={props.stylePinCodeColumnButtons}
          styleColumnDeleteButton={props.stylePinCodeColumnDeleteButton}
          styleContainer={props.stylePinCodeEnterContainer}
          styleContainerPinCode={props.stylePinCodeMainContainer}
          styleDeleteButtonColorHideUnderlay={props.stylePinCodeDeleteButtonColorHideUnderlay}
          styleDeleteButtonColorShowUnderlay={props.stylePinCodeDeleteButtonColorShowUnderlay}
          styleDeleteButtonIcon={props.stylePinCodeDeleteButtonIcon}
          styleDeleteButtonSize={props.stylePinCodeDeleteButtonSize}
          styleDeleteButtonText={props.stylePinCodeDeleteButtonText}
          styleEmptyColumn={props.stylePinCodeEmptyColumn}
          stylePinCodeCircle={props.stylePinCodeCircle}
          styleRowButtons={props.stylePinCodeRowButtons}
          styleTextButton={props.stylePinCodeTextButtonCircle}
          styleTextSubtitle={props.stylePinCodeTextSubtitle}
          styleTextTitle={props.stylePinCodeTextTitle}
          styleViewTitle={props.stylePinCodeViewTitle}
          subtitle={props.subtitleEnter || ""}
          subtitleComponent={props.subtitleComponent}
          subtitleError={props.subtitleError}
          textCancelButtonTouchID={props.textCancelButtonTouchID}
          textPasswordVisibleFamily={props.textPasswordVisibleFamily}
          textPasswordVisibleSize={props.textPasswordVisibleSize}
          title={props.titleEnter || "Enter your PIN Code"}
          titleAttemptFailed={props.titleAttemptFailed}
          titleComponent={props.titleComponent}
          titleConfirmFailed={props.titleConfirmFailed}
          timePinLockedAsyncStorageName={props.timePinLockedAsyncStorageName || timePinLockedAsyncStorageNameDefault}
          touchIDDisabled={props.touchIDDisabled || touchIDDisabledDefault}
          touchIDSentence={props.touchIDSentence || "To unlock your application"}
          touchIDTitle={props.touchIDTitle || touchIDTitleDefault}
          vibrationEnabled={props.vibrationEnabled}
          delayBetweenAttempts={props.delayBetweenAttempts}
        />}
      {(pinStatus === PinResultStatus.locked ||
        internalPinStatus === PinResultStatus.locked ||
        pinLocked) &&
        (props.lockedPage ? props.lockedPage() : renderLockedPage())}
    </View>
  );
}

export function hasUserSetPinCode(serviceName?: string) {
  return hasPinCode(serviceName || pinCodeKeychainNameDefault);
}

export function deleteUserPinCode(serviceName?: string) {
  return deletePinCode(serviceName || pinCodeKeychainNameDefault);
}

export function resetPinCodeInternalStates(pinAttempsStorageName?: string,
  timePinLockedStorageName?: string) {
  return resetInternalStates([
    pinAttempsStorageName || pinAttemptsAsyncStorageNameDefault,
    timePinLockedStorageName || timePinLockedAsyncStorageNameDefault
  ]);
}

export default PINCode;

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
