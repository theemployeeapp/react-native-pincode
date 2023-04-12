import { colors } from "./design/colors";
import { grid } from "./design/grid";
import delay from "./delay";
import { PinResultStatus } from "./utils";
import { useEffect, useState, useLayoutEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { easeLinear } from "d3-ease";
import Animate from "react-move/Animate";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import React = require("react");

export type IProps = {
  buttonComponent?: any
  changeStatus: (status: PinResultStatus) => void
  colorIcon?: string
  iconComponent?: any
  lockedIconComponent?: any
  nameIcon?: string
  onClickButton: any
  pinAttemptsAsyncStorageName: string
  sizeIcon?: number
  styleButton?: any
  styleMainContainer?: any
  styleText?: any
  styleTextButton?: any
  styleTextTimer?: any
  styleTitle?: any
  styleViewButton?: any
  styleViewIcon?: any
  styleViewTextLock?: any
  styleViewTimer?: any
  textButton: string
  textDescription?: string
  textSubDescription?: string
  textTitle?: string
  timePinLockedAsyncStorageName: string
  timeToLock: number
  timerComponent?: any
  titleComponent?: any
}

export type IState = {
  timeDiff: number
}

function ApplicationLocked (props: IProps) {
  const [timeDiff, setTimeDiff] = useState(0)
  const [isUnmounted, setIsUnmounted] = useState(false)
  const [timeLocked, setTimeLocked] = useState(0)

  useEffect(() => {
    AsyncStorage.getItem(props.timePinLockedAsyncStorageName).then(val => {
      setTimeLocked(new Date(val ? val : "").getTime() + props.timeToLock);
      timer();
    });
  }, [])

  const timer = async () => {
    const timeDiff = +new Date(timeLocked) - +new Date();
    setTimeDiff(Math.max(0, timeDiff));
    await delay(1000);
    if (timeDiff < 1000) {
      props.changeStatus(PinResultStatus.initial);
      AsyncStorage.multiRemove([
        props.timePinLockedAsyncStorageName,
        props.pinAttemptsAsyncStorageName
      ]);
    }
    if (!isUnmounted) {
      timer();
    }
  }

  useLayoutEffect(() => {
    return () => {
      setIsUnmounted(true)
    }
  }, [])

  const renderButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (props.onClickButton) {
            props.onClickButton();
          } else {
            throw "Quit application";
          }
        }}
        style={[styles.button, props.styleButton]}
        accessible
        accessibilityLabel={props.textButton}>
        <Text
          style={[
            styles.closeButtonText,
            props.styleTextButton
          ]}>
          {props.textButton}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTimer = (minutes: number, seconds: number) => {
    return (
      <View
        style={[
          styles.viewTimer,
          props.styleViewTimer
        ]}>
        <Text
          style={[
            styles.textTimer,
            props.styleTextTimer
          ]}>
          {`${minutes < 10 ? "0" + minutes : minutes}:${
            seconds < 10 ? "0" + seconds : seconds
            }`}
        </Text>
      </View>
    );
  };

  const renderTitle = () => {
    return (
      <Text
        style={[ styles.title, props.styleTitle]}>
        {props.textTitle || "Maximum attempts reached"}
      </Text>
    );
  };

  const renderIcon = () => {
    return (
      <View
        style={
          [ styles.viewIcon, props.styleViewIcon]
        }>
        {props.lockedIconComponent ?
          props.lockedIconComponent :
          <Icon
            name={props.nameIcon}
            size={props.sizeIcon}
            color={props.colorIcon}
          />}
      </View>
    );
  };

  const renderErrorLocked = () => {
    const minutes = Math.floor(timeDiff / 1000 / 60);
    const seconds = Math.floor(timeDiff / 1000) % 60;
    return (
      <View>
        <Animate
          show={true}
          start={{
            opacity: 0
          }}
          enter={{
            opacity: [1],
            timing: { delay: 1000, duration: 1500, ease: easeLinear }
          }}>
          {(state: any) => (
            <View
              style={[
                styles.viewTextLock,
                props.styleViewTextLock,
                { opacity: state.opacity }
              ]}>
              {props.titleComponent
                ? props.titleComponent()
                : renderTitle()}
              {props.timerComponent
                ? props.timerComponent()
                : renderTimer(minutes, seconds)}
              {props.iconComponent
                ? props.iconComponent()
                : renderIcon()}
              <Text
                style={[
                   styles.text,
                  props.styleText
                ]}>
                {props.textDescription
                  ? props.textDescription
                  : `To protect your information, access has been locked for ${Math.ceil(
                    props.timeToLock / 1000 / 60
                  )} minutes.`}
              </Text>
              <Text
              style={[
                 styles.text,
                props.styleText
              ]}>
                {props.textSubDescription
                  ? props.textSubDescription
                  : "Come back later and try again."}
              </Text>
            </View>
          )}
        </Animate>
        <Animate
          show={true}
          start={{
            opacity: 0
          }}
          enter={{
            opacity: [1],
            timing: { delay: 2000, duration: 1500, ease: easeLinear }
          }}>
          {(state: any) => (
            <View style={{ opacity: state.opacity, flex: 1 }}>
              <View
                style={[
                  styles.viewCloseButton,
                  props.styleViewButton
                ]}>
                {props.buttonComponent
                  ? props.buttonComponent()
                  : renderButton()}
              </View>
            </View>
          )}
        </Animate>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        props.styleMainContainer
      ]}>
      {renderErrorLocked()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    backgroundColor: colors.background,
    flexBasis: 0,
    left: 0,
    height: "100%",
    width: "100%",
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  text: {
    fontSize: grid.unit,
    color: colors.base,
    lineHeight: grid.unit * grid.lineHeight,
    textAlign: "center"
  },
  viewTextLock: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: grid.unit * 3,
    paddingRight: grid.unit * 3,
    flex: 3
  },
  textTimer: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 20,
    color: colors.base
  },
  title: {
    fontSize: grid.navIcon,
    color: colors.base,
    opacity: grid.mediumOpacity,
    fontWeight: "200",
    marginBottom: grid.unit * 4
  },
  viewIcon: {
    width: grid.unit * 4,
    justifyContent: "center",
    alignItems: "center",
    height: grid.unit * 4,
    borderRadius: grid.unit * 2,
    opacity: grid.mediumOpacity,
    backgroundColor: colors.alert,
    overflow: "hidden",
    marginBottom: grid.unit * 4
  },
  viewTimer: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 10,
    paddingTop: 10,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "rgb(230, 231, 233)",
    marginBottom: grid.unit * 4
  },
  viewCloseButton: {
    alignItems: "center",
    opacity: grid.mediumOpacity,
    justifyContent: "center",
    marginTop: grid.unit * 2
  },
  button: {
    backgroundColor: colors.turquoise,
    borderRadius: grid.border,
    paddingLeft: grid.unit * 2,
    paddingRight: grid.unit * 2,
    paddingBottom: grid.unit,
    paddingTop: grid.unit
  },
  closeButtonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 14
  }
});

export default ApplicationLocked;
