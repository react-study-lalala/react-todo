import { getContext } from "redux-saga/effects";

export const HISTORY_ACTION_TYPE = {
    POP: 'POP',
    PUSH: 'PUSH',
}

export function* push(targetUrl) {
    const history = yield getContext('history');
    history.push(targetUrl)
}

export function* redirect(targetUrl) {
    const history = yield getContext('history');
    history.replace(targetUrl)
}