import { ScreenSizes, type IBoardDimensions, type Sizes } from "$lib/constants/boards";
import { isLarge, isMediumLarge, isMediumSmall } from "$lib/utils/mediaQuery";
const { Small, MediumLarge, MediumSmall, Large} = ScreenSizes;

function setAllowedBoards(boards: Record<Sizes, IBoardDimensions>): IBoardDimensions[] {
    const containsSmall = true;
    let containsMediumSmall = false;
    let containsMediumLarge = false;
    let containsLarge = false;

    if (isLarge()) {
        containsLarge = true;
        containsMediumLarge = true;
        containsMediumSmall = true;
    } else if (isMediumLarge()) {
        containsMediumLarge = true;
        containsMediumSmall = true;
    } else if (isMediumSmall()) {
        containsMediumSmall = true;
    };
    const boardTypes = Object.keys(boards) as Sizes[];

    let allBoards = [];

    for (let boardType of boardTypes) {
        const board = boards[boardType];
        let pushBoard = false;

        if (board.maxScreenSize === Small && containsSmall) pushBoard = true;
        if (board.maxScreenSize === MediumSmall && containsMediumSmall) pushBoard = true;
        if (board.maxScreenSize === MediumLarge && containsMediumLarge) pushBoard = true;
        if (board.maxScreenSize === Large && containsLarge) pushBoard = true;

        if (pushBoard) {
            allBoards.push({ ...board, boardType });
        }
    }

    return allBoards;
} 

export default setAllowedBoards;