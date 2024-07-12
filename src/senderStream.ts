let senderStream = {};

export function handleSenderStream(type: string, username?: any) {
    if (type === "read") {
        return senderStream;
    }

    if (type === "reset") {
        senderStream = {};
        return {msg: "ok"};
    }

    if (type === "all") {
        if (Object.keys(senderStream).length > 0) {
            return {msg: "streams available", data: Object.keys(senderStream) };
        } else {
            return {msg: "no streams available", data: []};
        }
    }

    if (type === "close") {
        const newObject = {};
        Object.keys(senderStream).filter(item => item !== username).map(item => {
        newObject[item] = senderStream[item];
        });
        senderStream = newObject;
        return {msg: "ok"};
    }

    if (type === "view") {
        return senderStream[username];
    }

    if (type === "validate") {
        if (senderStream[username]) {
            return {msg: false};
        } else {
            return {msg: true};
        }
    }
}

export function handleTrackEvent(e, peer, username: any) {
    senderStream[username] = e.streams[0];
};