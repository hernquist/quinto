function isSmall() {
    return window.innerWidth <= 420;
}

function isMediumSmall() {
    return window.innerWidth > 420 && window.innerWidth <= 600;
}

function isMediumLarge() {
    return window.innerWidth > 600 && window.innerWidth <= 768;
}

function isLarge() {
    return window.innerWidth > 768;
}

export { isSmall, isMediumSmall, isMediumLarge, isLarge };