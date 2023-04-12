"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PinCode_1 = require("./PinCode");
const utils_1 = require("./utils");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Keychain = require("react-native-keychain");
const React = require("react");
function PinCodeChoose(props) {
    const [status, setStatus] = (0, react_1.useState)(PinCode_1.PinStatus.choose);
    const [pinCode, setPinCode] = (0, react_1.useState)('');
    const endProcessCreation = (pinCodeVar, isErrorValidation) => {
        if (isErrorValidation) {
            setPinCode('');
            setStatus(PinCode_1.PinStatus.choose);
        }
        else {
            setPinCode(pinCodeVar);
            setStatus(PinCode_1.PinStatus.confirm);
        }
    };
    const endProcessConfirm = async (pinCodeVar) => {
        if (pinCodeVar === pinCode) {
            if (props.storePin) {
                props.storePin(pinCodeVar);
            }
            else {
                await Keychain.setInternetCredentials(props.pinCodeKeychainName, props.pinCodeKeychainName, pinCodeVar, utils_1.noBiometricsConfig);
            }
            if (!!props.finishProcess)
                props.finishProcess(pinCodeVar);
        }
        else {
            setStatus(PinCode_1.PinStatus.choose);
        }
    };
    const cancelConfirm = () => {
        setStatus(PinCode_1.PinStatus.choose);
    };
    return (React.createElement(react_native_1.View, { key: Math.random(), style: [
            styles.container,
            props.styleContainer
        ] },
        status === PinCode_1.PinStatus.choose && (React.createElement(PinCode_1.default, { alphabetCharsVisible: props.alphabetCharsVisible, buttonDeleteComponent: props.buttonDeleteComponent || null, buttonDeleteText: props.buttonDeleteText, buttonNumberComponent: props.buttonNumberComponent || null, colorCircleButtons: props.colorCircleButtons, colorPassword: props.colorPassword || undefined, colorPasswordEmpty: props.colorPasswordEmpty, colorPasswordError: props.colorPasswordError || undefined, customBackSpaceIcon: props.customBackSpaceIcon, emptyColumnComponent: props.emptyColumnComponent, endProcess: endProcessCreation, getCurrentLength: props.getCurrentLength, iconButtonDeleteDisabled: props.iconButtonDeleteDisabled, numbersButtonOverlayColor: props.numbersButtonOverlayColor || undefined, passwordComponent: props.passwordComponent || null, passwordLength: props.passwordLength || 4, pinCodeVisible: props.pinCodeVisible, sentenceTitle: props.titleChoose, status: PinCode_1.PinStatus.choose, styleAlphabet: props.styleAlphabet, styleButtonCircle: props.styleButtonCircle, styleCircleHiddenPassword: props.styleCircleHiddenPassword, styleCircleSizeEmpty: props.styleCircleSizeEmpty, styleCircleSizeFull: props.styleCircleSizeFull, styleColorButtonTitle: props.styleColorButtonTitle, styleColorButtonTitleSelected: props.styleColorButtonTitleSelected, styleColorSubtitle: props.styleColorSubtitle, styleColorSubtitleError: props.styleColorSubtitleError, styleColorTitle: props.styleColorTitle, styleColorTitleError: props.styleColorTitleError, styleColumnButtons: props.styleColumnButtons, styleColumnDeleteButton: props.styleColumnDeleteButton, styleContainer: props.styleContainerPinCode, styleDeleteButtonColorHideUnderlay: props.styleDeleteButtonColorHideUnderlay, styleDeleteButtonColorShowUnderlay: props.styleDeleteButtonColorShowUnderlay, styleDeleteButtonIcon: props.styleDeleteButtonIcon, styleDeleteButtonSize: props.styleDeleteButtonSize, styleDeleteButtonText: props.styleDeleteButtonText, styleEmptyColumn: props.styleEmptyColumn, stylePinCodeCircle: props.stylePinCodeCircle, styleRowButtons: props.styleRowButtons, styleTextButton: props.styleTextButton, styleTextSubtitle: props.styleTextSubtitle, styleTextTitle: props.styleTextTitle, styleViewTitle: props.styleViewTitle, subtitle: props.subtitleChoose, subtitleComponent: props.subtitleComponent || null, subtitleError: props.subtitleError || 'Please try again', textPasswordVisibleFamily: props.textPasswordVisibleFamily, textPasswordVisibleSize: props.textPasswordVisibleSize, titleComponent: props.titleComponent || null, titleValidationFailed: props.titleValidationFailed || 'PIN code unsafe', validationRegex: props.validationRegex, vibrationEnabled: props.vibrationEnabled })),
        status === PinCode_1.PinStatus.confirm && (React.createElement(PinCode_1.default, { alphabetCharsVisible: props.alphabetCharsVisible, buttonDeleteComponent: props.buttonDeleteComponent || null, buttonDeleteText: props.buttonDeleteText, buttonNumberComponent: props.buttonNumberComponent || null, cancelFunction: cancelConfirm, colorCircleButtons: props.colorCircleButtons, colorPassword: props.colorPassword || undefined, colorPasswordEmpty: props.colorPasswordEmpty, colorPasswordError: props.colorPasswordError || undefined, customBackSpaceIcon: props.customBackSpaceIcon, emptyColumnComponent: props.emptyColumnComponent, endProcess: endProcessConfirm, getCurrentLength: props.getCurrentLength, iconButtonDeleteDisabled: props.iconButtonDeleteDisabled, numbersButtonOverlayColor: props.numbersButtonOverlayColor || undefined, passwordComponent: props.passwordComponent || null, passwordLength: props.passwordLength || 4, pinCodeVisible: props.pinCodeVisible, previousPin: pinCode, sentenceTitle: props.titleConfirm, status: PinCode_1.PinStatus.confirm, subtitle: props.subtitleConfirm, subtitleComponent: props.subtitleComponent || null, subtitleError: props.subtitleError || 'Please try again', textPasswordVisibleFamily: props.textPasswordVisibleFamily, textPasswordVisibleSize: props.textPasswordVisibleSize, titleAttemptFailed: props.titleAttemptFailed || 'Incorrect PIN Code', titleComponent: props.titleComponent || null, titleConfirmFailed: props.titleConfirmFailed || 'Your entries did not match', styleAlphabet: props.styleAlphabet, styleButtonCircle: props.styleButtonCircle, styleCircleHiddenPassword: props.styleCircleHiddenPassword, styleCircleSizeEmpty: props.styleCircleSizeEmpty, styleCircleSizeFull: props.styleCircleSizeFull, styleColorButtonTitle: props.styleColorButtonTitle, styleColorButtonTitleSelected: props.styleColorButtonTitleSelected, styleColorSubtitle: props.styleColorSubtitle, styleColorSubtitleError: props.styleColorSubtitleError, styleColorTitle: props.styleColorTitle, styleColorTitleError: props.styleColorTitleError, styleColumnButtons: props.styleColumnButtons, styleColumnDeleteButton: props.styleColumnDeleteButton, styleContainer: props.styleContainerPinCode, styleDeleteButtonColorHideUnderlay: props.styleDeleteButtonColorHideUnderlay, styleDeleteButtonColorShowUnderlay: props.styleDeleteButtonColorShowUnderlay, styleDeleteButtonIcon: props.styleDeleteButtonIcon, styleDeleteButtonSize: props.styleDeleteButtonSize, styleDeleteButtonText: props.styleDeleteButtonText, styleEmptyColumn: props.styleEmptyColumn, stylePinCodeCircle: props.stylePinCodeCircle, styleRowButtons: props.styleRowButtons, styleTextButton: props.styleTextButton, styleTextSubtitle: props.styleTextSubtitle, styleTextTitle: props.styleTextTitle, styleViewTitle: props.styleViewTitle, vibrationEnabled: props.vibrationEnabled, delayBetweenAttempts: props.delayBetweenAttempts }))));
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
exports.default = PinCodeChoose;
