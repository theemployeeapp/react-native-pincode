"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delay_1 = require("./delay");
const PinCode_1 = require("./PinCode");
const utils_1 = require("./utils");
const react_1 = require("react");
const async_storage_1 = require("@react-native-async-storage/async-storage");
const react_native_1 = require("react-native");
const Keychain = require("react-native-keychain");
const react_native_touch_id_1 = require("react-native-touch-id");
const React = require("react");
function PinCodeEnter(props) {
    const [pinCodeStatus, setPinCodeStatus] = (0, react_1.useState)(utils_1.PinResultStatus.initial);
    const [locked, setLocked] = (0, react_1.useState)(false);
    const [keyChainResult, setKeyChainResult] = (0, react_1.useState)(undefined);
    function usePrevious(value) {
        const ref = (0, react_1.useRef)();
        (0, react_1.useEffect)(() => {
            ref.current = value;
        });
        return ref.current;
    }
    (0, react_1.useEffect)(() => {
        if (!props.touchIDDisabled)
            triggerTouchID();
        if (!props.storedPin) {
            Keychain.getInternetCredentials(props.pinCodeKeychainName, utils_1.noBiometricsConfig).then(result => {
                setKeyChainResult(result && result.password || undefined);
            }).catch(error => {
                console.log('PinCodeEnter: ', error);
            });
        }
    }, []);
    (0, react_1.useEffect)(() => {
        const prevProps = usePrevious({ pinStatusExternal: props.pinStatusExternal, touchIDDisabled: props.touchIDDisabled });
        if (prevProps && (prevProps.pinStatusExternal !== props.pinStatusExternal)) {
            setPinCodeStatus(props.pinStatusExternal);
        }
        if (prevProps && (prevProps.touchIDDisabled && !props.touchIDDisabled)) {
            triggerTouchID();
        }
    }, [props.pinStatusExternal, props.touchIDDisabled]);
    const triggerTouchID = () => {
        !!react_native_touch_id_1.default && react_native_touch_id_1.default.isSupported()
            .then(() => {
            setTimeout(() => {
                launchTouchID();
            });
        })
            .catch((error) => {
            console.warn('TouchID error', error);
        });
    };
    const endProcess = async (pinCode) => {
        if (!!props.endProcessFunction) {
            props.endProcessFunction(pinCode);
        }
        else {
            let pinValidOverride = undefined;
            if (props.handleResult) {
                pinValidOverride = await Promise.resolve(props.handleResult(pinCode));
            }
            setPinCodeStatus(utils_1.PinResultStatus.initial);
            props.changeInternalStatus(utils_1.PinResultStatus.initial);
            const pinAttemptsStr = await async_storage_1.default.getItem(props.pinAttemptsAsyncStorageName);
            let pinAttempts = pinAttemptsStr ? +pinAttemptsStr : 0;
            const pin = props.storedPin || keyChainResult;
            if (pinValidOverride !== undefined ? pinValidOverride : pin === pinCode) {
                setPinCodeStatus(utils_1.PinResultStatus.success);
                async_storage_1.default.multiRemove([
                    props.pinAttemptsAsyncStorageName,
                    props.timePinLockedAsyncStorageName
                ]);
                props.changeInternalStatus(utils_1.PinResultStatus.success);
                if (!!props.finishProcess)
                    props.finishProcess(pinCode);
            }
            else {
                pinAttempts++;
                if (+pinAttempts >= props.maxAttempts &&
                    !props.disableLockScreen) {
                    await async_storage_1.default.setItem(props.timePinLockedAsyncStorageName, new Date().toISOString());
                    setPinCodeStatus(utils_1.PinResultStatus.locked);
                    setLocked(true);
                    props.changeInternalStatus(utils_1.PinResultStatus.locked);
                }
                else {
                    await async_storage_1.default.setItem(props.pinAttemptsAsyncStorageName, pinAttempts.toString());
                    setPinCodeStatus(utils_1.PinResultStatus.failure);
                    props.changeInternalStatus(utils_1.PinResultStatus.failure);
                }
                if (props.onFail) {
                    await (0, delay_1.default)(1500);
                    props.onFail(pinAttempts);
                }
            }
        }
    };
    const launchTouchID = async () => {
        const optionalConfigObject = {
            imageColor: '#e00606',
            imageErrorColor: '#ff0000',
            sensorDescription: 'Touch sensor',
            sensorErrorDescription: 'Failed',
            cancelText: props.textCancelButtonTouchID || 'Cancel',
            fallbackLabel: 'Show Passcode',
            unifiedErrors: false,
            passcodeFallback: props.passcodeFallback
        };
        try {
            await react_native_touch_id_1.default.authenticate(props.touchIDSentence, Object.assign({}, optionalConfigObject, {
                title: props.touchIDTitle
            })).then((success) => {
                endProcess(props.storedPin || keyChainResult);
            });
        }
        catch (e) {
            if (!!props.callbackErrorTouchId) {
                props.callbackErrorTouchId(e);
            }
            else {
                console.log('TouchID error', e);
            }
        }
    };
    const pin = props.storedPin || keyChainResult;
    return (React.createElement(react_native_1.View, { style: [
            styles.container,
            props.styleContainer
        ] },
        React.createElement(PinCode_1.default, { alphabetCharsVisible: props.alphabetCharsVisible, buttonDeleteComponent: props.buttonDeleteComponent || null, buttonDeleteText: props.buttonDeleteText, buttonNumberComponent: props.buttonNumberComponent || null, colorCircleButtons: props.colorCircleButtons, colorPassword: props.colorPassword || undefined, colorPasswordEmpty: props.colorPasswordEmpty, colorPasswordError: props.colorPasswordError || undefined, customBackSpaceIcon: props.customBackSpaceIcon, emptyColumnComponent: props.emptyColumnComponent, endProcess: endProcess, launchTouchID: launchTouchID, getCurrentLength: props.getCurrentLength, iconButtonDeleteDisabled: props.iconButtonDeleteDisabled, numbersButtonOverlayColor: props.numbersButtonOverlayColor || undefined, passwordComponent: props.passwordComponent || null, passwordLength: props.passwordLength || 4, pinCodeStatus: pinCodeStatus, pinCodeVisible: props.pinCodeVisible, previousPin: pin, sentenceTitle: props.title, status: PinCode_1.PinStatus.enter, styleAlphabet: props.styleAlphabet, styleButtonCircle: props.styleButtonCircle, styleCircleHiddenPassword: props.styleCircleHiddenPassword, styleCircleSizeEmpty: props.styleCircleSizeEmpty, styleCircleSizeFull: props.styleCircleSizeFull, styleColumnButtons: props.styleColumnButtons, styleColumnDeleteButton: props.styleColumnDeleteButton, styleColorButtonTitle: props.styleColorButtonTitle, styleColorButtonTitleSelected: props.styleColorButtonTitleSelected, styleColorSubtitle: props.styleColorSubtitle, styleColorSubtitleError: props.styleColorSubtitleError, styleColorTitle: props.styleColorTitle, styleColorTitleError: props.styleColorTitleError, styleContainer: props.styleContainerPinCode, styleDeleteButtonColorHideUnderlay: props.styleDeleteButtonColorHideUnderlay, styleDeleteButtonColorShowUnderlay: props.styleDeleteButtonColorShowUnderlay, styleDeleteButtonIcon: props.styleDeleteButtonIcon, styleDeleteButtonSize: props.styleDeleteButtonSize, styleDeleteButtonText: props.styleDeleteButtonText, styleEmptyColumn: props.styleEmptyColumn, stylePinCodeCircle: props.stylePinCodeCircle, styleRowButtons: props.styleRowButtons, styleTextButton: props.styleTextButton, styleTextSubtitle: props.styleTextSubtitle, styleTextTitle: props.styleTextTitle, styleViewTitle: props.styleViewTitle, subtitle: props.subtitle, subtitleComponent: props.subtitleComponent || null, subtitleError: props.subtitleError || 'Please try again', textPasswordVisibleFamily: props.textPasswordVisibleFamily, textPasswordVisibleSize: props.textPasswordVisibleSize, titleAttemptFailed: props.titleAttemptFailed || 'Incorrect PIN Code', titleComponent: props.titleComponent || null, titleConfirmFailed: props.titleConfirmFailed || 'Your entries did not match', vibrationEnabled: props.vibrationEnabled, delayBetweenAttempts: props.delayBetweenAttempts })));
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
exports.default = PinCodeEnter;
