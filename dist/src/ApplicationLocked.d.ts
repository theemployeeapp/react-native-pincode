/// <reference types="react" />
import { PinResultStatus } from "./utils";
export type IProps = {
    buttonComponent?: any;
    changeStatus: (status: PinResultStatus) => void;
    colorIcon?: string;
    iconComponent?: any;
    lockedIconComponent?: any;
    nameIcon?: string;
    onClickButton: any;
    pinAttemptsAsyncStorageName: string;
    sizeIcon?: number;
    styleButton?: any;
    styleMainContainer?: any;
    styleText?: any;
    styleTextButton?: any;
    styleTextTimer?: any;
    styleTitle?: any;
    styleViewButton?: any;
    styleViewIcon?: any;
    styleViewTextLock?: any;
    styleViewTimer?: any;
    textButton: string;
    textDescription?: string;
    textSubDescription?: string;
    textTitle?: string;
    timePinLockedAsyncStorageName: string;
    timeToLock: number;
    timerComponent?: any;
    titleComponent?: any;
};
export type IState = {
    timeDiff: number;
};
declare function ApplicationLocked(props: IProps): JSX.Element;
export default ApplicationLocked;
