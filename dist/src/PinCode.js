"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinStatus = void 0;
const delay_1 = require("./delay");
const grid_1 = require("./design/grid");
const d3_ease_1 = require("d3-ease");
const _ = require("lodash");
const react_1 = require("react");
const Animate_1 = require("react-move/Animate");
const react_native_1 = require("react-native");
const react_native_easy_grid_1 = require("react-native-easy-grid");
const MaterialIcons_1 = require("react-native-vector-icons/MaterialIcons");
const React = require("react");
var PinStatus;
(function (PinStatus) {
    PinStatus["choose"] = "choose";
    PinStatus["confirm"] = "confirm";
    PinStatus["enter"] = "enter";
})(PinStatus = exports.PinStatus || (exports.PinStatus = {}));
function PinCode(props) {
    const [password, setPassword] = (0, react_1.useState)("");
    const [moveData, setMoveData] = (0, react_1.useState)({ x: 0, y: 0 });
    const [showError, setShowError] = (0, react_1.useState)(false);
    const [textButtonSelected, setTextButtonSelected] = (0, react_1.useState)("");
    const [colorDelete, setColorDelete] = (0, react_1.useState)(null);
    const [attemptFailed, setAttemptFailed] = (0, react_1.useState)(false);
    const [changeScreen, setChangeScreen] = (0, react_1.useState)(false);
    const [circleSizeEmpty, setCircleSizeEmpty] = (0, react_1.useState)(props.styleCircleSizeEmpty || 4);
    const [circleSizeFull, setCircleSizeFull] = (0, react_1.useState)(props.styleCircleSizeFull || (props.pinCodeVisible ? 6 : 8));
    function usePrevious(value) {
        const ref = (0, react_1.useRef)();
        (0, react_1.useEffect)(() => {
            ref.current = value;
        });
        return ref.current;
    }
    (0, react_1.useEffect)(() => {
        if (props.getCurrentLength)
            props.getCurrentLength(0);
    }, []);
    (0, react_1.useEffect)(() => {
        const prevStatus = usePrevious(props.pinCodeStatus);
        if (prevStatus !== "failure" &&
            props.pinCodeStatus === "failure") {
            failedAttempt();
        }
        if (prevStatus !== "locked" &&
            props.pinCodeStatus === "locked") {
            setPassword("");
        }
    }, [props.pinCodeStatus]);
    const failedAttempt = async () => {
        await (0, delay_1.default)(300);
        setShowError(true);
        setAttemptFailed(true);
        setChangeScreen(false);
        doShake();
        await (0, delay_1.default)(props.delayBetweenAttempts);
        newAttempt();
    };
    const newAttempt = async () => {
        setChangeScreen(true);
        await (0, delay_1.default)(200);
        setShowError(false);
        setAttemptFailed(false);
        setChangeScreen(false);
        setPassword("");
    };
    const onPressButtonNumber = async (text) => {
        const currentPassword = password + text;
        setPassword(currentPassword);
        if (props.getCurrentLength)
            props.getCurrentLength(currentPassword.length);
        if (currentPassword.length === props.passwordLength) {
            switch (props.status) {
                case PinStatus.choose:
                    if (props.validationRegex &&
                        props.validationRegex.test(currentPassword)) {
                        showErrorFunc(true);
                    }
                    else {
                        endProcess(currentPassword);
                    }
                    break;
                case PinStatus.confirm:
                    if (currentPassword !== props.previousPin) {
                        showErrorFunc();
                    }
                    else {
                        endProcess(currentPassword);
                    }
                    break;
                case PinStatus.enter:
                    props.endProcess(currentPassword);
                    await (0, delay_1.default)(300);
                    break;
                default:
                    break;
            }
        }
    };
    const renderButtonNumber = (text) => {
        let alphanumericMap = new Map([
            ["1", " "],
            ["2", "ABC"],
            ["3", "DEF"],
            ["4", "GHI"],
            ["5", "JKL"],
            ["6", "MNO"],
            ["7", "PQRS"],
            ["8", "TUV"],
            ["9", "WXYZ"],
            ["0", " "]
        ]);
        const disabled = (password.length === props.passwordLength ||
            showError) &&
            !attemptFailed;
        return (React.createElement(Animate_1.default, { key: Math.random(), show: true, start: {
                opacity: 1
            }, update: {
                opacity: [
                    showError && !attemptFailed ? 0.5 : 1
                ],
                timing: { duration: 200, ease: d3_ease_1.easeLinear }
            } }, ({ opacity }) => (React.createElement(react_native_1.TouchableHighlight, { key: text, style: [
                styles.buttonCircle,
                { backgroundColor: props.colorCircleButtons },
                props.styleButtonCircle,
            ], underlayColor: props.numbersButtonOverlayColor, disabled: disabled, onShowUnderlay: () => setTextButtonSelected(text), onHideUnderlay: () => setTextButtonSelected(""), onPress: () => {
                onPressButtonNumber(text);
            }, accessible: true, accessibilityLabel: text },
            React.createElement(react_native_1.View, null,
                React.createElement(react_native_1.Text, { key: text, style: [
                        styles.text,
                        props.styleTextButton,
                        {
                            opacity: opacity,
                            color: textButtonSelected === text
                                ? props.styleColorButtonTitleSelected
                                : props.styleColorButtonTitle
                        }
                    ] }, text),
                ((props.alphabetCharsVisible) &&
                    React.createElement(react_native_1.Text, { style: [
                            styles.tinytext,
                            props.styleAlphabet,
                            {
                                opacity: opacity,
                                color: textButtonSelected === text
                                    ? props.styleColorButtonTitleSelected
                                    : props.styleColorButtonTitle
                            }
                        ] }, alphanumericMap.get(text))))))));
    };
    const endProcess = (pwd) => {
        setTimeout(() => {
            this.setState({ changeScreen: true });
            setTimeout(() => {
                props.endProcess(pwd);
            }, 500);
        }, 400);
    };
    const doShake = async () => {
        const duration = 70;
        if (props.vibrationEnabled)
            react_native_1.Vibration.vibrate(500, false);
        const length = react_native_1.Dimensions.get("window").width / 3;
        await (0, delay_1.default)(duration);
        setMoveData({ x: length, y: 0 });
        await (0, delay_1.default)(duration);
        setMoveData({ x: -length, y: 0 });
        await (0, delay_1.default)(duration);
        setMoveData({ x: length / 2, y: 0 });
        await (0, delay_1.default)(duration);
        setMoveData({ x: -length / 2, y: 0 });
        await (0, delay_1.default)(duration);
        setMoveData({ x: length / 4, y: 0 });
        await (0, delay_1.default)(duration);
        setMoveData({ x: -length / 4, y: 0 });
        await (0, delay_1.default)(duration);
        setMoveData({ x: 0, y: 0 });
        if (props.getCurrentLength)
            props.getCurrentLength(0);
    };
    const showErrorFunc = async (isErrorValidation = false) => {
        setChangeScreen(true);
        await (0, delay_1.default)(300);
        setChangeScreen(true);
        setShowError(true);
        doShake();
        await (0, delay_1.default)(3000);
        setChangeScreen(true);
        await (0, delay_1.default)(200);
        setShowError(false);
        setPassword("");
        await (0, delay_1.default)(200);
        props.endProcess(password, isErrorValidation);
        if (isErrorValidation)
            setChangeScreen(false);
    };
    const renderCirclePassword = () => {
        const colorPwdErr = props.colorPasswordError;
        const colorPwd = props.colorPassword;
        const colorPwdEmp = props.colorPasswordEmpty || colorPwd;
        return (React.createElement(react_native_1.View, { style: [styles.topViewCirclePassword, props.styleCircleHiddenPassword] }, _.range(props.passwordLength).map((val) => {
            const lengthSup = ((password.length >= val + 1 && !changeScreen) || showError) &&
                !attemptFailed;
            return (React.createElement(Animate_1.default, { key: val, show: true, start: {
                    opacity: 0.5,
                    height: circleSizeEmpty,
                    width: circleSizeEmpty,
                    borderRadius: circleSizeEmpty / 2,
                    color: colorPwdEmp,
                    marginRight: 10,
                    marginLeft: 10,
                    x: 0,
                    y: 0
                }, update: {
                    x: [moveData.x],
                    opacity: [lengthSup ? 1 : 0.5],
                    height: [
                        lengthSup ? circleSizeFull : circleSizeEmpty
                    ],
                    width: [
                        lengthSup ? circleSizeFull : circleSizeEmpty
                    ],
                    color: [
                        showError
                            ? colorPwdErr
                            : (lengthSup && password.length > 0)
                                ? colorPwd
                                : colorPwdEmp
                    ],
                    borderRadius: [
                        lengthSup
                            ? circleSizeFull / 2
                            : circleSizeEmpty / 2
                    ],
                    marginRight: [
                        lengthSup
                            ? 10 - (circleSizeFull - circleSizeEmpty) / 2
                            : 10
                    ],
                    marginLeft: [
                        lengthSup
                            ? 10 - (circleSizeFull - circleSizeEmpty) / 2
                            : 10
                    ],
                    y: [moveData.y],
                    timing: { duration: 200, ease: d3_ease_1.easeLinear }
                } }, ({ opacity, x, height, width, color, borderRadius, marginRight, marginLeft }) => (React.createElement(react_native_1.View, { style: styles.viewCircles }, ((!props.pinCodeVisible ||
                (props.pinCodeVisible && !lengthSup)) && (React.createElement(react_native_1.View, { style: [{
                        left: x,
                        height: height,
                        width: width,
                        opacity: opacity,
                        borderRadius: borderRadius,
                        marginLeft: marginLeft,
                        marginRight: marginRight,
                        backgroundColor: color
                    }, props.stylePinCodeCircle] }))) || (React.createElement(react_native_1.View, { style: {
                    left: x,
                    opacity: opacity,
                    marginLeft: marginLeft,
                    marginRight: marginRight
                } },
                React.createElement(react_native_1.Text, { style: {
                        color: color,
                        fontFamily: props.textPasswordVisibleFamily,
                        fontSize: props.textPasswordVisibleSize
                    } }, password[val])))))));
        })));
    };
    const renderButtonDelete = (opacity) => {
        return (React.createElement(react_native_1.TouchableHighlight, { activeOpacity: 1, disabled: password.length === 0, underlayColor: "transparent", onHideUnderlay: () => setColorDelete(props.styleDeleteButtonColorHideUnderlay), onShowUnderlay: () => setColorDelete(props.styleDeleteButtonColorShowUnderlay), onPress: () => {
                if (password.length > 0) {
                    const newPass = password.slice(0, -1);
                    setPassword(newPass);
                    if (props.getCurrentLength)
                        props.getCurrentLength(newPass.length);
                }
            }, accessible: true, accessibilityLabel: props.buttonDeleteText },
            React.createElement(react_native_1.View, { style: [styles.colIcon, props.styleColumnDeleteButton] }, props.customBackSpaceIcon ?
                props.customBackSpaceIcon({ colorDelete: colorDelete, opacity })
                :
                    React.createElement(React.Fragment, null,
                        !props.iconButtonDeleteDisabled && (React.createElement(MaterialIcons_1.default, { name: props.styleDeleteButtonIcon, size: props.styleDeleteButtonSize, color: colorDelete, style: { opacity: opacity } })),
                        React.createElement(react_native_1.Text, { style: [
                                styles.textDeleteButton,
                                props.styleDeleteButtonText,
                                { color: colorDelete, opacity: opacity }
                            ] }, props.buttonDeleteText)))));
    };
    const renderTitle = (colorTitle, opacityTitle, attemptFailed, showError) => {
        return (React.createElement(react_native_1.Text, { style: [
                styles.textTitle,
                props.styleTextTitle,
                { color: colorTitle, opacity: opacityTitle }
            ] }, (attemptFailed && props.titleAttemptFailed) ||
            (showError && props.titleConfirmFailed) ||
            (showError && props.titleValidationFailed) ||
            props.sentenceTitle));
    };
    const renderSubtitle = (colorTitle, opacityTitle, attemptFailed, showError) => {
        return (React.createElement(react_native_1.Text, { style: [
                styles.textSubtitle,
                props.styleTextSubtitle,
                { color: colorTitle, opacity: opacityTitle }
            ] }, attemptFailed || showError
            ? props.subtitleError
            : props.subtitle));
    };
    return (React.createElement(react_native_1.View, { style: [
            styles.container,
            props.styleContainer
        ] },
        React.createElement(Animate_1.default, { show: true, start: {
                opacity: 0,
                colorTitle: props.styleColorTitle,
                colorSubtitle: props.styleColorSubtitle,
                opacityTitle: 1
            }, enter: {
                opacity: [1],
                colorTitle: [
                    props.styleColorTitle
                ],
                colorSubtitle: [
                    props.styleColorSubtitle
                ],
                opacityTitle: [1],
                timing: { duration: 200, ease: d3_ease_1.easeLinear }
            }, update: {
                opacity: [changeScreen ? 0 : 1],
                colorTitle: [
                    showError || attemptFailed
                        ? props.styleColorTitleError
                        : props.styleColorTitle
                ],
                colorSubtitle: [
                    showError || attemptFailed
                        ? props.styleColorSubtitleError
                        : props.styleColorSubtitle
                ],
                opacityTitle: [showError || attemptFailed ? grid_1.grid.highOpacity : 1],
                timing: { duration: 200, ease: d3_ease_1.easeLinear }
            } }, ({ opacity, colorTitle, colorSubtitle, opacityTitle }) => (React.createElement(react_native_1.View, { style: [
                styles.viewTitle,
                props.styleViewTitle,
                { opacity: opacity }
            ] },
            props.titleComponent
                ? props.titleComponent()
                : renderTitle(colorTitle, opacityTitle, attemptFailed, showError),
            props.subtitleComponent
                ? props.subtitleComponent()
                : renderSubtitle(colorSubtitle, opacityTitle, attemptFailed, showError)))),
        React.createElement(react_native_1.View, { style: styles.flexCirclePassword }, props.passwordComponent
            ? props.passwordComponent()
            : renderCirclePassword()),
        React.createElement(react_native_easy_grid_1.Grid, { style: styles.grid },
            React.createElement(react_native_easy_grid_1.Row, { style: [
                    styles.row,
                    props.styleRowButtons
                ] }, _.range(1, 4).map((i) => {
                return (React.createElement(react_native_easy_grid_1.Col, { key: i, style: [
                        styles.colButtonCircle,
                        props.styleColumnButtons
                    ] }, props.buttonNumberComponent
                    ? props.buttonNumberComponent(i, onPressButtonNumber)
                    : this.renderButtonNumber(i.toString())));
            })),
            React.createElement(react_native_easy_grid_1.Row, { style: [
                    styles.row,
                    props.styleRowButtons
                ] }, _.range(4, 7).map((i) => {
                return (React.createElement(react_native_easy_grid_1.Col, { key: i, style: [
                        styles.colButtonCircle,
                        props.styleColumnButtons
                    ] }, props.buttonNumberComponent
                    ? props.buttonNumberComponent(i, onPressButtonNumber)
                    : this.renderButtonNumber(i.toString())));
            })),
            React.createElement(react_native_easy_grid_1.Row, { style: [
                    styles.row,
                    props.styleRowButtons
                ] }, _.range(7, 10).map((i) => {
                return (React.createElement(react_native_easy_grid_1.Col, { key: i, style: [
                        styles.colButtonCircle,
                        props.styleColumnButtons
                    ] }, props.buttonNumberComponent
                    ? props.buttonNumberComponent(i, onPressButtonNumber)
                    : this.renderButtonNumber(i.toString())));
            })),
            React.createElement(react_native_easy_grid_1.Row, { style: [
                    styles.row,
                    styles.rowWithEmpty,
                    props.styleRowButtons
                ] },
                React.createElement(react_native_easy_grid_1.Col, { style: [
                        styles.colEmpty,
                        props.styleEmptyColumn
                    ] }, props.emptyColumnComponent
                    ? props.emptyColumnComponent(props.launchTouchID)
                    : null),
                React.createElement(react_native_easy_grid_1.Col, { style: [
                        styles.colButtonCircle,
                        props.styleColumnButtons
                    ] }, props.buttonNumberComponent
                    ? props.buttonNumberComponent("0", onPressButtonNumber)
                    : this.renderButtonNumber("0")),
                React.createElement(react_native_easy_grid_1.Col, { style: [
                        styles.colButtonCircle,
                        props.styleColumnButtons
                    ] },
                    React.createElement(Animate_1.default, { show: true, start: {
                            opacity: 0.5
                        }, update: {
                            opacity: [
                                password.length === 0 ||
                                    password.length === props.passwordLength
                                    ? 0.5
                                    : 1
                            ],
                            timing: { duration: 400, ease: d3_ease_1.easeLinear }
                        } }, ({ opacity }) => props.buttonDeleteComponent
                        ? props.buttonDeleteComponent(() => {
                            if (password.length > 0) {
                                const newPass = password.slice(0, -1);
                                this.setState({ password: newPass });
                                if (props.getCurrentLength)
                                    props.getCurrentLength(newPass.length);
                            }
                        })
                        : renderButtonDelete(opacity)))))));
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    viewTitle: {
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        flex: 2
    },
    row: {
        flex: 0,
        flexShrink: 1,
        alignItems: "center",
        height: grid_1.grid.unit * 5.5
    },
    rowWithEmpty: {
        flexShrink: 0,
        justifyContent: 'flex-end',
    },
    colButtonCircle: {
        flex: 0,
        marginLeft: grid_1.grid.unit / 2,
        marginRight: grid_1.grid.unit / 2,
        alignItems: "center",
        width: grid_1.grid.unit * 4,
        height: grid_1.grid.unit * 4
    },
    colEmpty: {
        flex: 0,
        marginLeft: grid_1.grid.unit / 2,
        marginRight: grid_1.grid.unit / 2,
        width: grid_1.grid.unit * 4,
        height: grid_1.grid.unit * 4
    },
    colIcon: {
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
    },
    text: {
        fontSize: grid_1.grid.unit * 2,
        fontWeight: "200"
    },
    tinytext: {
        fontSize: grid_1.grid.unit / 2,
        fontWeight: "300"
    },
    buttonCircle: {
        alignItems: "center",
        justifyContent: "center",
        width: grid_1.grid.unit * 4,
        height: grid_1.grid.unit * 4,
        backgroundColor: "rgb(242, 245, 251)",
        borderRadius: grid_1.grid.unit * 2
    },
    textTitle: {
        fontSize: 20,
        fontWeight: "200",
        lineHeight: grid_1.grid.unit * 2.5
    },
    textSubtitle: {
        fontSize: grid_1.grid.unit,
        fontWeight: "200",
        textAlign: "center"
    },
    flexCirclePassword: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center"
    },
    topViewCirclePassword: {
        flexDirection: "row",
        height: "auto",
        justifyContent: "center",
        alignItems: "center"
    },
    viewCircles: {
        justifyContent: "center",
        alignItems: "center"
    },
    textDeleteButton: {
        fontWeight: "200",
        marginTop: 5
    },
    grid: {
        justifyContent: 'flex-start',
        width: "100%",
        flex: 7
    }
});
exports.default = PinCode;
