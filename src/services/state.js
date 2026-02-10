export const state = {
    events: [],
    selectedEvent: null,
    registrants: [],
    loading: false,
    error: null,
    eventSearch: '',
};

function getState() {
    return { ...state };
}

function setState(changeData) {
    Object.assign(state, changeData);

    // NOTE: (peter) - Creating a state-changed event that can be listened to to trigger render updates.
    window.dispatchEvent(
        new CustomEvent('state-changed', {
            detail: getState(),
        }),
    );
}
export const store = {
    getState,
    setState,
};
