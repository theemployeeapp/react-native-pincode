import delay from "./delay";
import { colors } from "./design/colors";
import { grid } from "./design/grid";

import { easeLinear } from "d3-ease";
import * as _ from "lodash";
import { useEffect, useState, useRef } from 'react';
import Animate from "react-move/Animate";
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableHighlight,
  Vibration,
  View,
  ViewStyle
} from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/MaterialIcons";
import React = require("react");

/**
 * Pin Code Component
 */

export interface IProps {
  alphabetCharsVisible?: boolean
  buttonDeleteComponent?: any
  buttonDeleteText?: string
  buttonNumberComponent?: any
  cancelFunction?: () => void
  colorCircleButtons?: string
  colorPassword: string
  colorPasswordEmpty?: string
  colorPasswordError: string
  customBackSpaceIcon?: Function
  emptyColumnComponent: any
  endProcess: (pinCode: string, isErrorValidation?: boolean) => void
  launchTouchID?: () => void
  getCurrentLength?: (length: number) => void
  iconButtonDeleteDisabled?: boolean
  numbersButtonOverlayColor: string
  passwordComponent?: any
  passwordLength: number
  pinCodeStatus?: "initial" | "success" | "failure" | "locked"
  pinCodeVisible?: boolean
  previousPin?: string
  sentenceTitle: string
  status: PinStatus
  styleAlphabet?: StyleProp<TextStyle>
  styleButtonCircle?: StyleProp<ViewStyle>
  styleCircleHiddenPassword?: StyleProp<ViewStyle>
  styleCircleSizeEmpty?: number
  styleCircleSizeFull?: number
  styleColorButtonTitle?: string
  styleColorButtonTitleSelected?: string
  styleColorSubtitle: string
  styleColorSubtitleError: string
  styleColorTitle: string
  styleColorTitleError: string
  styleColumnButtons?: StyleProp<ViewStyle>
  styleColumnDeleteButton?: StyleProp<ViewStyle>
  styleContainer?: StyleProp<ViewStyle>
  styleDeleteButtonColorHideUnderlay: string
  styleDeleteButtonColorShowUnderlay: string
  styleDeleteButtonIcon: string
  styleDeleteButtonSize: number
  styleDeleteButtonText?: StyleProp<TextStyle>
  styleEmptyColumn?: StyleProp<ViewStyle>
  stylePinCodeCircle?: StyleProp<ViewStyle>
  styleRowButtons?: StyleProp<ViewStyle>
  styleTextButton?: StyleProp<TextStyle>
  styleTextSubtitle?: StyleProp<TextStyle>
  styleTextTitle?: StyleProp<TextStyle>
  styleViewTitle?: StyleProp<ViewStyle>
  subtitle: string
  subtitleComponent?: any
  subtitleError: string
  textPasswordVisibleFamily: string
  textPasswordVisibleSize: number
  titleAttemptFailed?: string
  titleComponent?: any
  titleConfirmFailed?: string
  titleValidationFailed?: string
  validationRegex?: RegExp
  vibrationEnabled?: boolean
  delayBetweenAttempts?: number;
}

export interface IState {
  password: string
  moveData: { x: number; y: number }
  showError?: boolean
  textButtonSelected: string
  colorDelete: string
  attemptFailed?: boolean
  changeScreen?: boolean
}

export enum PinStatus {
  choose = "choose",
  confirm = "confirm",
  enter = "enter"
}

function PinCode (props: IProps) {
  const [password, setPassword] = useState("")
  const [moveData, setMoveData] = useState({ x: 0, y: 0 })
  const [showError, setShowError] = useState(false)
  const [textButtonSelected, setTextButtonSelected] = useState("")
  const [colorDelete, setColorDelete] = useState(null)
  const [attemptFailed, setAttemptFailed] = useState(false)
  const [changeScreen, setChangeScreen] = useState(false)
  const [circleSizeEmpty, setCircleSizeEmpty] = useState(this.props.styleCircleSizeEmpty || 4)
  const [circleSizeFull, setCircleSizeFull] = useState(this.props.styleCircleSizeFull || (this.props.pinCodeVisible ? 6 : 8))

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  useEffect(() => {
    if (this.props.getCurrentLength) this.props.getCurrentLength(0);
  }, [])

  useEffect(() => {
    const prevStatus = usePrevious(this.props.pinCodeStatus);

    if (
      prevStatus !== "failure" &&
      this.props.pinCodeStatus === "failure"
    ) {
      failedAttempt();
    }
    if (
      prevStatus !== "locked" &&
      this.props.pinCodeStatus === "locked"
    ) {
      setPassword("");
    }
  }, [this.props.pinCodeStatus])

  const failedAttempt = async () => {
    await delay(300);
    setShowError(true);
    setAttemptFailed(true);
    setChangeScreen(false);
    doShake();
    await delay(this.props.delayBetweenAttempts);
    newAttempt();
  };

  const newAttempt = async () => {
    setChangeScreen(true);
    await delay(200);
    setShowError(false);
    setAttemptFailed(false);
    setChangeScreen(false);
    setPassword("");
  };

  const onPressButtonNumber = async (text: string) => {
    const currentPassword = password + text;
    setPassword(currentPassword)
    if (this.props.getCurrentLength) this.props.getCurrentLength(currentPassword.length);
    if (currentPassword.length === this.props.passwordLength) {
      switch (this.props.status) {
        case PinStatus.choose:
          if (
            this.props.validationRegex &&
            this.props.validationRegex.test(currentPassword)
          ) {
            showErrorFunc(true);
          } else {
            endProcess(currentPassword);
          }
          break;
        case PinStatus.confirm:
          if (currentPassword !== this.props.previousPin) {
            showErrorFunc();
          } else {
            endProcess(currentPassword);
          }
          break;
        case PinStatus.enter:
          this.props.endProcess(currentPassword);
          await delay(300);
          break;
        default:
          break;
      }
    }
  };

  const renderButtonNumber = (text: string) => {
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
    const disabled =
      (password.length === this.props.passwordLength ||
        showError) &&
      !attemptFailed;
    return (
      <Animate
        key={Math.random()}
        show={true}
        start={{
          opacity: 1
        }}
        update={{
          opacity: [
            showError && !attemptFailed ? 0.5 : 1
          ],
          timing: { duration: 200, ease: easeLinear }
        }}>
        {({ opacity }: any) => (
          <TouchableHighlight
            key={text}
            style={[
              styles.buttonCircle,
              { backgroundColor: this.props.colorCircleButtons },
              this.props.styleButtonCircle,
            ]}
            underlayColor={this.props.numbersButtonOverlayColor}
            disabled={disabled}
            onShowUnderlay={() => setTextButtonSelected(text)}
            onHideUnderlay={() => setTextButtonSelected("")}
            onPress={() => {
              onPressButtonNumber(text);
            }}
            accessible
            accessibilityLabel={text}>
            <View>
            <Text
              key={text}
              style={[
                styles.text,
                this.props.styleTextButton,
                {
                  opacity: opacity,
                  color: textButtonSelected === text
                    ? this.props.styleColorButtonTitleSelected
                    : this.props.styleColorButtonTitle
                }
              ]}>
              {text}
            </Text>
            {((this.props.alphabetCharsVisible) &&
              <Text
                style={[
                  styles.tinytext,
                  this.props.styleAlphabet,
                {
                  opacity: opacity,
                  color: textButtonSelected === text
                    ? this.props.styleColorButtonTitleSelected
                    : this.props.styleColorButtonTitle
                }
                ]}>
                {alphanumericMap.get(text)}
              </Text>
            )}
            </View>
          </TouchableHighlight>
        )}
      </Animate>
    );
  };

  const endProcess = (pwd: string) => {
    setTimeout(() => {
      this.setState({ changeScreen: true });
      setTimeout(() => {
        this.props.endProcess(pwd);
      }, 500);
    }, 400);
  };

  const doShake = async () => {
    const duration = 70;
    if (this.props.vibrationEnabled) Vibration.vibrate(500, false);
    const length = Dimensions.get("window").width / 3;
    await delay(duration);
    setMoveData({ x: length, y: 0 });
    await delay(duration);
    setMoveData({ x: -length, y: 0 });
    await delay(duration);
    setMoveData({ x: length / 2, y: 0 });
    await delay(duration);
    setMoveData({ x: -length / 2, y: 0 });
    await delay(duration);
    setMoveData({ x: length / 4, y: 0 });
    await delay(duration);
    setMoveData({ x: -length / 4, y: 0 });
    await delay(duration);
    setMoveData({ x: 0, y: 0 });
    if (this.props.getCurrentLength) this.props.getCurrentLength(0);
  }

  const showErrorFunc = async (isErrorValidation = false) => {
    setChangeScreen(true);
    await delay(300);
    setChangeScreen(true);
    setShowError(true);
    doShake();
    await delay(3000);
    setChangeScreen(true);
    await delay(200);
    setShowError(false);
    setPassword("");
    await delay(200);
    this.props.endProcess(password, isErrorValidation);
    if (isErrorValidation) setChangeScreen(false);
  }

  const renderCirclePassword = () => {
    const colorPwdErr = this.props.colorPasswordError;
    const colorPwd = this.props.colorPassword;
    const colorPwdEmp = this.props.colorPasswordEmpty || colorPwd;
    return (
      <View
        style={[styles.topViewCirclePassword, this.props.styleCircleHiddenPassword]}>
        {_.range(this.props.passwordLength).map((val: number) => {
          const lengthSup =
            ((password.length >= val + 1 && !changeScreen) || showError) &&
            !attemptFailed;
          return (
            <Animate
              key={val}
              show={true}
              start={{
                opacity: 0.5,
                height: circleSizeEmpty,
                width: circleSizeEmpty,
                borderRadius: circleSizeEmpty / 2,
                color: colorPwdEmp,
                marginRight: 10,
                marginLeft: 10,
                x: 0,
                y: 0
              }}
              update={{
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
                timing: { duration: 200, ease: easeLinear }
              }}>
              {({
                opacity,
                x,
                height,
                width,
                color,
                borderRadius,
                marginRight,
                marginLeft
              }: any) => (
                  <View style={styles.viewCircles}>
                    {((!this.props.pinCodeVisible ||
                      (this.props.pinCodeVisible && !lengthSup)) && (
                        <View
                          style={[{
                            left: x,
                            height: height,
                            width: width,
                            opacity: opacity,
                            borderRadius: borderRadius,
                            marginLeft: marginLeft,
                            marginRight: marginRight,
                            backgroundColor: color
                          }, this.props.stylePinCodeCircle]}
                        />
                      )) || (
                        <View
                          style={{
                            left: x,
                            opacity: opacity,
                            marginLeft: marginLeft,
                            marginRight: marginRight
                          }}>
                          <Text
                            style={{
                              color: color,
                              fontFamily: this.props.textPasswordVisibleFamily,
                              fontSize: this.props.textPasswordVisibleSize
                            }}>
                            {password[val]}
                          </Text>
                        </View>
                      )}
                  </View>
                )}
            </Animate>
          );
        })}
      </View>
    );
  };

  const renderButtonDelete = (opacity: number) => {
    return (
      <TouchableHighlight
        activeOpacity={1}
        disabled={password.length === 0}
        underlayColor="transparent"
        onHideUnderlay={() =>
          setColorDelete(this.props.styleDeleteButtonColorHideUnderlay)
        }
        onShowUnderlay={() =>
          setColorDelete(this.props.styleDeleteButtonColorShowUnderlay)
        }
        onPress={() => {
          if (password.length > 0) {
            const newPass = password.slice(0, -1);
            setPassword(newPass);
            if (this.props.getCurrentLength)
              this.props.getCurrentLength(newPass.length);
          }
        }}
        accessible
        accessibilityLabel={this.props.buttonDeleteText}>
        <View
          style={[styles.colIcon, this.props.styleColumnDeleteButton]}>
          {this.props.customBackSpaceIcon ?
            this.props.customBackSpaceIcon({ colorDelete: colorDelete, opacity })
            :
            <>
              {!this.props.iconButtonDeleteDisabled && (
                <Icon
                  name={this.props.styleDeleteButtonIcon}
                  size={this.props.styleDeleteButtonSize}
                  color={colorDelete}
                  style={{ opacity: opacity }}
                />
              )}
              <Text
                style={[
                  styles.textDeleteButton,
                  this.props.styleDeleteButtonText,
                  { color: colorDelete, opacity: opacity }
                ]}>
                {this.props.buttonDeleteText}
              </Text>
            </>
          }
        </View>
      </TouchableHighlight>
    );
  };

  const renderTitle = (
    colorTitle: string,
    opacityTitle: number,
    attemptFailed?: boolean,
    showError?: boolean
  ) => {
    return (
      <Text
        style={[
          styles.textTitle,
          this.props.styleTextTitle,
          { color: colorTitle, opacity: opacityTitle }
        ]}>
        {(attemptFailed && this.props.titleAttemptFailed) ||
          (showError && this.props.titleConfirmFailed) ||
          (showError && this.props.titleValidationFailed) ||
          this.props.sentenceTitle}
      </Text>
    );
  };

  const renderSubtitle = (
    colorTitle: string,
    opacityTitle: number,
    attemptFailed?: boolean,
    showError?: boolean
  ) => {
    return (
      <Text
        style={[
          styles.textSubtitle,
          this.props.styleTextSubtitle,
          { color: colorTitle, opacity: opacityTitle }
        ]}>
        {attemptFailed || showError
          ? this.props.subtitleError
          : this.props.subtitle}
      </Text>
    );
  };

  return (
    <View
      style={[
        styles.container,
        this.props.styleContainer
      ]}>
      <Animate
        show={true}
        start={{
          opacity: 0,
          colorTitle: this.props.styleColorTitle,
          colorSubtitle: this.props.styleColorSubtitle,
          opacityTitle: 1
        }}
        enter={{
          opacity: [1],
          colorTitle: [
            this.props.styleColorTitle
          ],
          colorSubtitle: [
            this.props.styleColorSubtitle
          ],
          opacityTitle: [1],
          timing: { duration: 200, ease: easeLinear }
        }}
        update={{
          opacity: [changeScreen ? 0 : 1],
          colorTitle: [
            showError || attemptFailed
              ? this.props.styleColorTitleError
              : this.props.styleColorTitle
          ],
          colorSubtitle: [
            showError || attemptFailed
              ? this.props.styleColorSubtitleError
              : this.props.styleColorSubtitle
          ],
          opacityTitle: [showError || attemptFailed ? grid.highOpacity : 1],
          timing: { duration: 200, ease: easeLinear }
        }}>
        {({ opacity, colorTitle, colorSubtitle, opacityTitle }: any) => (
          <View
            style={[
              styles.viewTitle,
              this.props.styleViewTitle,
              { opacity: opacity }
            ]}>
            {this.props.titleComponent
              ? this.props.titleComponent()
              : renderTitle(
                colorTitle,
                opacityTitle,
                attemptFailed,
                showError
              )}
            {this.props.subtitleComponent
              ? this.props.subtitleComponent()
              : renderSubtitle(
                colorSubtitle,
                opacityTitle,
                attemptFailed,
                showError
              )}
          </View>
        )}
      </Animate>
      <View style={styles.flexCirclePassword}>
        {this.props.passwordComponent
          ? this.props.passwordComponent()
          : renderCirclePassword()}
      </View>
      <Grid style={styles.grid}>
        <Row
          style={[
            styles.row,
            this.props.styleRowButtons
          ]}>
          {_.range(1, 4).map((i: number) => {
            return (
              <Col
                key={i}
                style={[
                  styles.colButtonCircle,
                  this.props.styleColumnButtons
                ]}>
                {this.props.buttonNumberComponent
                  ? this.props.buttonNumberComponent(
                    i,
                    onPressButtonNumber
                  )
                  : this.renderButtonNumber(i.toString())}
              </Col>
            );
          })}
        </Row>
        <Row
          style={[
            styles.row,
            this.props.styleRowButtons
          ]}>
          {_.range(4, 7).map((i: number) => {
            return (
              <Col
                key={i}
                style={[
                  styles.colButtonCircle,
                  this.props.styleColumnButtons
                ]}>
                {this.props.buttonNumberComponent
                  ? this.props.buttonNumberComponent(
                    i,
                    onPressButtonNumber
                  )
                  : this.renderButtonNumber(i.toString())}
              </Col>
            );
          })}
        </Row>
        <Row
          style={[
            styles.row,
            this.props.styleRowButtons
          ]}>
          {_.range(7, 10).map((i: number) => {
            return (
              <Col
                key={i}
                style={[
                  styles.colButtonCircle,
                  this.props.styleColumnButtons
                ]}>
                {this.props.buttonNumberComponent
                  ? this.props.buttonNumberComponent(
                    i,
                    onPressButtonNumber
                  )
                  : this.renderButtonNumber(i.toString())}
              </Col>
            );
          })}
        </Row>
        <Row
          style={[
            styles.row,
            styles.rowWithEmpty,
            this.props.styleRowButtons
          ]}>
          <Col
            style={[
              styles.colEmpty,
              this.props.styleEmptyColumn
            ]}>
            {this.props.emptyColumnComponent
              ? this.props.emptyColumnComponent(this.props.launchTouchID)
              : null
            }
          </Col>
          <Col
            style={[
              styles.colButtonCircle,
              this.props.styleColumnButtons
            ]}>
            {this.props.buttonNumberComponent
              ? this.props.buttonNumberComponent(
                "0",
                onPressButtonNumber
              )
              : this.renderButtonNumber("0")}
          </Col>
          <Col
            style={[
              styles.colButtonCircle,
              this.props.styleColumnButtons
            ]}>
            <Animate
              show={true}
              start={{
                opacity: 0.5
              }}
              update={{
                opacity: [
                  password.length === 0 ||
                    password.length === this.props.passwordLength
                    ? 0.5
                    : 1
                ],
                timing: { duration: 400, ease: easeLinear }
              }}>
              {({ opacity }: any) =>
                this.props.buttonDeleteComponent
                  ? this.props.buttonDeleteComponent(() => {
                    if (password.length > 0) {
                      const newPass = password.slice(0, -1);
                      this.setState({ password: newPass });
                      if (this.props.getCurrentLength)
                        this.props.getCurrentLength(newPass.length);
                    }
                  })
                  : renderButtonDelete(opacity)
              }
            </Animate>
          </Col>
        </Row>
      </Grid>
    </View>
  )
}

const styles = StyleSheet.create({
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
    height: grid.unit * 5.5
  },
  rowWithEmpty: {
    flexShrink: 0,
    justifyContent: 'flex-end',
  },
  colButtonCircle: {
    flex: 0,
    marginLeft: grid.unit / 2,
    marginRight: grid.unit / 2,
    alignItems: "center",
    width: grid.unit * 4,
    height: grid.unit * 4
  },
  colEmpty: {
    flex: 0,
    marginLeft: grid.unit / 2,
    marginRight: grid.unit / 2,
    width: grid.unit * 4,
    height: grid.unit * 4
  },
  colIcon: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  text: {
    fontSize: grid.unit * 2,
    fontWeight: "200"
  },
  tinytext: {
    fontSize: grid.unit/2,
    fontWeight: "300"
  },
  buttonCircle: {
    alignItems: "center",
    justifyContent: "center",
    width: grid.unit * 4,
    height: grid.unit * 4,
    backgroundColor: "rgb(242, 245, 251)",
    borderRadius: grid.unit * 2
  },
  textTitle: {
    fontSize: 20,
    fontWeight: "200",
    lineHeight: grid.unit * 2.5
  },
  textSubtitle: {
    fontSize: grid.unit,
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

export default PinCode;
