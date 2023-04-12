"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPinCodeInternalStates = exports.deleteUserPinCode = exports.hasUserSetPinCode = void 0;
const ApplicationLocked_1 = require("./src/ApplicationLocked");
const PinCode_1 = require("./src/PinCode");
const PinCodeChoose_1 = require("./src/PinCodeChoose");
const PinCodeEnter_1 = require("./src/PinCodeEnter");
const utils_1 = require("./src/utils");
const react_1 = require("react");
const async_storage_1 = require("@react-native-async-storage/async-storage");
const react_native_1 = require("react-native");
const React = require("react");
const disableLockScreenDefault = false;
const timePinLockedAsyncStorageNameDefault = "timePinLockedRNPin";
const pinAttemptsAsyncStorageNameDefault = "pinAttemptsRNPin";
const pinCodeKeychainNameDefault = "reactNativePinCode";
const touchIDDisabledDefault = false;
const touchIDTitleDefault = 'Authentication Required';
function PINCode(props) {
    const [internalPinStatus, setInternalPinStatus] = (0, react_1.useState)(utils_1.PinResultStatus.initial);
    const [pinLocked, setPinLocked] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        async_storage_1.default.getItem(props.timePinLockedAsyncStorageName || timePinLockedAsyncStorageNameDefault).then((val) => {
            setPinLocked(!!val);
        }).catch(error => {
            console.log('PINCode: ', error);
        });
    }, []);
    const changeInternalStatus = (status) => {
        if (status === utils_1.PinResultStatus.initial)
            setPinLocked(false);
        setInternalPinStatus(status);
    };
    const renderLockedPage = () => {
        return (React.createElement(ApplicationLocked_1.default, { buttonComponent: props.buttonComponentLockedPage || null, changeStatus: changeInternalStatus, colorIcon: props.styleLockScreenColorIcon, iconComponent: props.iconComponentLockedPage || null, lockedIconComponent: props.lockedIconComponent, nameIcon: props.styleLockScreenNameIcon, onClickButton: props.onClickButtonLockedPage || (() => {
                throw ("Quit application");
            }), pinAttemptsAsyncStorageName: props.pinAttemptsAsyncStorageName || pinAttemptsAsyncStorageNameDefault, sizeIcon: props.styleLockScreenSizeIcon, styleButton: props.styleLockScreenButton, styleMainContainer: props.styleLockScreenMainContainer, styleText: props.styleLockScreenText, styleTextButton: props.styleLockScreenTextButton, styleTextTimer: props.styleLockScreenTextTimer, styleTitle: props.styleLockScreenTitle, styleViewButton: props.styleLockScreenViewCloseButton, styleViewIcon: props.styleLockScreenViewIcon, styleViewTextLock: props.styleLockScreenViewTextLock, styleViewTimer: props.styleLockScreenViewTimer, textButton: props.textButtonLockedPage || "Quit", textDescription: props.textDescriptionLockedPage || undefined, textSubDescription: props.textSubDescriptionLockedPage || undefined, textTitle: props.textTitleLockedPage || undefined, timePinLockedAsyncStorageName: props.timePinLockedAsyncStorageName || timePinLockedAsyncStorageNameDefault, timerComponent: props.timerComponentLockedPage || null, timeToLock: props.timeLocked || 300000, titleComponent: props.titleComponentLockedPage || undefined }));
    };
    const { status, pinStatus, styleMainContainer } = props;
    return (React.createElement(react_native_1.View, { style: [styles.container, styleMainContainer] },
        status === PinCode_1.PinStatus.choose &&
            React.createElement(PinCodeChoose_1.default, { alphabetCharsVisible: props.alphabetCharsVisible, buttonDeleteComponent: props.buttonDeleteComponent, buttonDeleteText: props.buttonDeleteText, buttonNumberComponent: props.buttonNumberComponent, colorCircleButtons: props.colorCircleButtons, colorPassword: props.colorPassword, colorPasswordEmpty: props.colorPasswordEmpty, colorPasswordError: props.colorPasswordError, customBackSpaceIcon: props.customBackSpaceIcon, emptyColumnComponent: props.bottomLeftComponent, finishProcess: props.finishProcess, getCurrentLength: props.getCurrentPinLength, iconButtonDeleteDisabled: props.iconButtonDeleteDisabled, numbersButtonOverlayColor: props.numbersButtonOverlayColor, passwordComponent: props.passwordComponent, passwordLength: props.passwordLength, pinCodeKeychainName: props.pinCodeKeychainName || pinCodeKeychainNameDefault, pinCodeVisible: props.pinCodeVisible, storePin: props.storePin || null, styleAlphabet: props.styleAlphabet, styleButtonCircle: props.stylePinCodeButtonCircle, styleCircleHiddenPassword: props.stylePinCodeHiddenPasswordCircle, styleCircleSizeEmpty: props.stylePinCodeHiddenPasswordSizeEmpty, styleCircleSizeFull: props.stylePinCodeHiddenPasswordSizeFull, styleColorButtonTitle: props.stylePinCodeButtonNumber, styleColorButtonTitleSelected: props.stylePinCodeButtonNumberPressed, styleColorSubtitle: props.stylePinCodeColorSubtitle, styleColorSubtitleError: props.stylePinCodeColorSubtitleError, styleColorTitle: props.stylePinCodeColorTitle, styleColorTitleError: props.stylePinCodeColorTitleError, styleColumnButtons: props.stylePinCodeColumnButtons, styleColumnDeleteButton: props.stylePinCodeColumnDeleteButton, styleContainer: props.stylePinCodeChooseContainer, styleContainerPinCode: props.stylePinCodeMainContainer, styleDeleteButtonColorHideUnderlay: props.stylePinCodeDeleteButtonColorHideUnderlay, styleDeleteButtonColorShowUnderlay: props.stylePinCodeDeleteButtonColorShowUnderlay, styleDeleteButtonIcon: props.stylePinCodeDeleteButtonIcon, styleDeleteButtonSize: props.stylePinCodeDeleteButtonSize, styleDeleteButtonText: props.stylePinCodeDeleteButtonText, styleEmptyColumn: props.stylePinCodeEmptyColumn, stylePinCodeCircle: props.stylePinCodeCircle, styleRowButtons: props.stylePinCodeRowButtons, styleTextButton: props.stylePinCodeTextButtonCircle, styleTextSubtitle: props.stylePinCodeTextSubtitle, styleTextTitle: props.stylePinCodeTextTitle, styleViewTitle: props.stylePinCodeViewTitle, subtitleChoose: props.subtitleChoose || "to keep your information secure", subtitleComponent: props.subtitleComponent, subtitleConfirm: props.subtitleConfirm || "", subtitleError: props.subtitleError, textPasswordVisibleFamily: props.textPasswordVisibleFamily, textPasswordVisibleSize: props.textPasswordVisibleSize, titleAttemptFailed: props.titleAttemptFailed, titleChoose: props.titleChoose || "1 - Enter a PIN Code", titleComponent: props.titleComponent, titleConfirm: props.titleConfirm || "2 - Confirm your PIN Code", titleConfirmFailed: props.titleConfirmFailed, titleValidationFailed: props.titleValidationFailed, validationRegex: props.validationRegex, vibrationEnabled: props.vibrationEnabled, delayBetweenAttempts: props.delayBetweenAttempts }),
        status === PinCode_1.PinStatus.enter &&
            React.createElement(PinCodeEnter_1.default, { alphabetCharsVisible: props.alphabetCharsVisible, passcodeFallback: props.passcodeFallback, buttonDeleteComponent: props.buttonDeleteComponent, buttonDeleteText: props.buttonDeleteText, buttonNumberComponent: props.buttonNumberComponent, callbackErrorTouchId: props.callbackErrorTouchId, changeInternalStatus: changeInternalStatus, colorCircleButtons: props.colorCircleButtons, colorPassword: props.colorPassword, colorPasswordEmpty: props.colorPasswordEmpty, colorPasswordError: props.colorPasswordError, customBackSpaceIcon: props.customBackSpaceIcon, disableLockScreen: props.disableLockScreen || disableLockScreenDefault, emptyColumnComponent: props.bottomLeftComponent, endProcessFunction: props.endProcessFunction, finishProcess: props.finishProcess, getCurrentLength: props.getCurrentPinLength, handleResult: props.handleResultEnterPin || null, iconButtonDeleteDisabled: props.iconButtonDeleteDisabled, maxAttempts: props.maxAttempts || 3, numbersButtonOverlayColor: props.numbersButtonOverlayColor, onFail: props.onFail || null, passwordComponent: props.passwordComponent, passwordLength: props.passwordLength, pinAttemptsAsyncStorageName: props.pinAttemptsAsyncStorageName || pinAttemptsAsyncStorageNameDefault, pinCodeKeychainName: props.pinCodeKeychainName || pinCodeKeychainNameDefault, pinCodeVisible: props.pinCodeVisible, pinStatusExternal: props.pinStatus || utils_1.PinResultStatus.initial, status: PinCode_1.PinStatus.enter, storedPin: props.storedPin || null, styleAlphabet: props.styleAlphabet, styleButtonCircle: props.stylePinCodeButtonCircle, styleCircleHiddenPassword: props.stylePinCodeHiddenPasswordCircle, styleCircleSizeEmpty: props.stylePinCodeHiddenPasswordSizeEmpty, styleCircleSizeFull: props.stylePinCodeHiddenPasswordSizeFull, styleColorButtonTitle: props.stylePinCodeButtonNumber, styleColorButtonTitleSelected: props.stylePinCodeButtonNumberPressed, styleColorSubtitle: props.stylePinCodeColorSubtitle, styleColorSubtitleError: props.stylePinCodeColorSubtitleError, styleColorTitle: props.stylePinCodeColorTitle, styleColorTitleError: props.stylePinCodeColorTitleError, styleColumnButtons: props.stylePinCodeColumnButtons, styleColumnDeleteButton: props.stylePinCodeColumnDeleteButton, styleContainer: props.stylePinCodeEnterContainer, styleContainerPinCode: props.stylePinCodeMainContainer, styleDeleteButtonColorHideUnderlay: props.stylePinCodeDeleteButtonColorHideUnderlay, styleDeleteButtonColorShowUnderlay: props.stylePinCodeDeleteButtonColorShowUnderlay, styleDeleteButtonIcon: props.stylePinCodeDeleteButtonIcon, styleDeleteButtonSize: props.stylePinCodeDeleteButtonSize, styleDeleteButtonText: props.stylePinCodeDeleteButtonText, styleEmptyColumn: props.stylePinCodeEmptyColumn, stylePinCodeCircle: props.stylePinCodeCircle, styleRowButtons: props.stylePinCodeRowButtons, styleTextButton: props.stylePinCodeTextButtonCircle, styleTextSubtitle: props.stylePinCodeTextSubtitle, styleTextTitle: props.stylePinCodeTextTitle, styleViewTitle: props.stylePinCodeViewTitle, subtitle: props.subtitleEnter || "", subtitleComponent: props.subtitleComponent, subtitleError: props.subtitleError, textCancelButtonTouchID: props.textCancelButtonTouchID, textPasswordVisibleFamily: props.textPasswordVisibleFamily, textPasswordVisibleSize: props.textPasswordVisibleSize, title: props.titleEnter || "Enter your PIN Code", titleAttemptFailed: props.titleAttemptFailed, titleComponent: props.titleComponent, titleConfirmFailed: props.titleConfirmFailed, timePinLockedAsyncStorageName: props.timePinLockedAsyncStorageName || timePinLockedAsyncStorageNameDefault, touchIDDisabled: props.touchIDDisabled || touchIDDisabledDefault, touchIDSentence: props.touchIDSentence || "To unlock your application", touchIDTitle: props.touchIDTitle || touchIDTitleDefault, vibrationEnabled: props.vibrationEnabled, delayBetweenAttempts: props.delayBetweenAttempts }),
        (pinStatus === utils_1.PinResultStatus.locked ||
            internalPinStatus === utils_1.PinResultStatus.locked ||
            pinLocked) &&
            (props.lockedPage ? props.lockedPage() : renderLockedPage())));
}
function hasUserSetPinCode(serviceName) {
    return (0, utils_1.hasPinCode)(serviceName || pinCodeKeychainNameDefault);
}
exports.hasUserSetPinCode = hasUserSetPinCode;
function deleteUserPinCode(serviceName) {
    return (0, utils_1.deletePinCode)(serviceName || pinCodeKeychainNameDefault);
}
exports.deleteUserPinCode = deleteUserPinCode;
function resetPinCodeInternalStates(pinAttempsStorageName, timePinLockedStorageName) {
    return (0, utils_1.resetInternalStates)([
        pinAttempsStorageName || pinAttemptsAsyncStorageNameDefault,
        timePinLockedStorageName || timePinLockedAsyncStorageNameDefault
    ]);
}
exports.resetPinCodeInternalStates = resetPinCodeInternalStates;
exports.default = PINCode;
let styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});
