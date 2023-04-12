"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = require("./design/colors");
const grid_1 = require("./design/grid");
const delay_1 = require("./delay");
const utils_1 = require("./utils");
const react_1 = require("react");
const async_storage_1 = require("@react-native-async-storage/async-storage");
const d3_ease_1 = require("d3-ease");
const Animate_1 = require("react-move/Animate");
const react_native_1 = require("react-native");
const MaterialIcons_1 = require("react-native-vector-icons/MaterialIcons");
const React = require("react");
function ApplicationLocked(props) {
    const [timeDiff, setTimeDiff] = (0, react_1.useState)(0);
    const [isUnmounted, setIsUnmounted] = (0, react_1.useState)(false);
    const [timeLocked, setTimeLocked] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        async_storage_1.default.getItem(props.timePinLockedAsyncStorageName).then(val => {
            setTimeLocked(new Date(val ? val : "").getTime() + props.timeToLock);
            timer();
        });
    }, []);
    const timer = async () => {
        const timeDiff = +new Date(timeLocked) - +new Date();
        setTimeDiff(Math.max(0, timeDiff));
        await (0, delay_1.default)(1000);
        if (timeDiff < 1000) {
            props.changeStatus(utils_1.PinResultStatus.initial);
            async_storage_1.default.multiRemove([
                props.timePinLockedAsyncStorageName,
                props.pinAttemptsAsyncStorageName
            ]);
        }
        if (!isUnmounted) {
            timer();
        }
    };
    (0, react_1.useLayoutEffect)(() => {
        return () => {
            setIsUnmounted(true);
        };
    }, []);
    const renderButton = () => {
        return (React.createElement(react_native_1.TouchableOpacity, { onPress: () => {
                if (props.onClickButton) {
                    props.onClickButton();
                }
                else {
                    throw "Quit application";
                }
            }, style: [styles.button, props.styleButton], accessible: true, accessibilityLabel: props.textButton },
            React.createElement(react_native_1.Text, { style: [
                    styles.closeButtonText,
                    props.styleTextButton
                ] }, props.textButton)));
    };
    const renderTimer = (minutes, seconds) => {
        return (React.createElement(react_native_1.View, { style: [
                styles.viewTimer,
                props.styleViewTimer
            ] },
            React.createElement(react_native_1.Text, { style: [
                    styles.textTimer,
                    props.styleTextTimer
                ] }, `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`)));
    };
    const renderTitle = () => {
        return (React.createElement(react_native_1.Text, { style: [styles.title, props.styleTitle] }, props.textTitle || "Maximum attempts reached"));
    };
    const renderIcon = () => {
        return (React.createElement(react_native_1.View, { style: [styles.viewIcon, props.styleViewIcon] }, props.lockedIconComponent ?
            props.lockedIconComponent :
            React.createElement(MaterialIcons_1.default, { name: props.nameIcon, size: props.sizeIcon, color: props.colorIcon })));
    };
    const renderErrorLocked = () => {
        const minutes = Math.floor(timeDiff / 1000 / 60);
        const seconds = Math.floor(timeDiff / 1000) % 60;
        return (React.createElement(react_native_1.View, null,
            React.createElement(Animate_1.default, { show: true, start: {
                    opacity: 0
                }, enter: {
                    opacity: [1],
                    timing: { delay: 1000, duration: 1500, ease: d3_ease_1.easeLinear }
                } }, (state) => (React.createElement(react_native_1.View, { style: [
                    styles.viewTextLock,
                    props.styleViewTextLock,
                    { opacity: state.opacity }
                ] },
                props.titleComponent
                    ? props.titleComponent()
                    : renderTitle(),
                props.timerComponent
                    ? props.timerComponent()
                    : renderTimer(minutes, seconds),
                props.iconComponent
                    ? props.iconComponent()
                    : renderIcon(),
                React.createElement(react_native_1.Text, { style: [
                        styles.text,
                        props.styleText
                    ] }, props.textDescription
                    ? props.textDescription
                    : `To protect your information, access has been locked for ${Math.ceil(props.timeToLock / 1000 / 60)} minutes.`),
                React.createElement(react_native_1.Text, { style: [
                        styles.text,
                        props.styleText
                    ] }, props.textSubDescription
                    ? props.textSubDescription
                    : "Come back later and try again.")))),
            React.createElement(Animate_1.default, { show: true, start: {
                    opacity: 0
                }, enter: {
                    opacity: [1],
                    timing: { delay: 2000, duration: 1500, ease: d3_ease_1.easeLinear }
                } }, (state) => (React.createElement(react_native_1.View, { style: { opacity: state.opacity, flex: 1 } },
                React.createElement(react_native_1.View, { style: [
                        styles.viewCloseButton,
                        props.styleViewButton
                    ] }, props.buttonComponent
                    ? props.buttonComponent()
                    : renderButton()))))));
    };
    return (React.createElement(react_native_1.View, { style: [
            styles.container,
            props.styleMainContainer
        ] }, renderErrorLocked()));
}
const styles = react_native_1.StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        backgroundColor: colors_1.colors.background,
        flexBasis: 0,
        left: 0,
        height: "100%",
        width: "100%",
        alignItems: "center",
        flex: 1,
        justifyContent: "center"
    },
    text: {
        fontSize: grid_1.grid.unit,
        color: colors_1.colors.base,
        lineHeight: grid_1.grid.unit * grid_1.grid.lineHeight,
        textAlign: "center"
    },
    viewTextLock: {
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: grid_1.grid.unit * 3,
        paddingRight: grid_1.grid.unit * 3,
        flex: 3
    },
    textTimer: {
        fontFamily: react_native_1.Platform.OS === "ios" ? "Courier" : "monospace",
        fontSize: 20,
        color: colors_1.colors.base
    },
    title: {
        fontSize: grid_1.grid.navIcon,
        color: colors_1.colors.base,
        opacity: grid_1.grid.mediumOpacity,
        fontWeight: "200",
        marginBottom: grid_1.grid.unit * 4
    },
    viewIcon: {
        width: grid_1.grid.unit * 4,
        justifyContent: "center",
        alignItems: "center",
        height: grid_1.grid.unit * 4,
        borderRadius: grid_1.grid.unit * 2,
        opacity: grid_1.grid.mediumOpacity,
        backgroundColor: colors_1.colors.alert,
        overflow: "hidden",
        marginBottom: grid_1.grid.unit * 4
    },
    viewTimer: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 10,
        paddingTop: 10,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "rgb(230, 231, 233)",
        marginBottom: grid_1.grid.unit * 4
    },
    viewCloseButton: {
        alignItems: "center",
        opacity: grid_1.grid.mediumOpacity,
        justifyContent: "center",
        marginTop: grid_1.grid.unit * 2
    },
    button: {
        backgroundColor: colors_1.colors.turquoise,
        borderRadius: grid_1.grid.border,
        paddingLeft: grid_1.grid.unit * 2,
        paddingRight: grid_1.grid.unit * 2,
        paddingBottom: grid_1.grid.unit,
        paddingTop: grid_1.grid.unit
    },
    closeButtonText: {
        color: colors_1.colors.white,
        fontWeight: "bold",
        fontSize: 14
    }
});
exports.default = ApplicationLocked;
