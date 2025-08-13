interface IBoardDimensions {
    columns: number,
    rows: number,
    maxScreenSize: ScreenSizes,
}

enum Sizes {
    FourByFour = '4x4',
    FiveByFive = '5x5',
    SixBySix = '6x6',
    SevenBySeven = '7x7',
    EightByEight = '8x8',
    NineByNine = '9x9',
    TenByTen = '10x10',
}

enum ScreenSizes {
    Small = 'small',
    MediumSmall = 'medium-small',
    MediumLarge = 'medium-large',
    Large = 'large',
}

interface IBoardDimensions {
    columns: number,
    rows: number,
    maxScreenSize: ScreenSizes,
    boardType?: Sizes
}

const { FourByFour, FiveByFive, SixBySix, SevenBySeven, EightByEight, NineByNine, TenByTen } = Sizes;   
const { Small, MediumSmall, MediumLarge, Large } = ScreenSizes;

const boards: Record<Sizes, IBoardDimensions> = {
    [FourByFour]: {
        columns: 4,
        rows: 4,
        maxScreenSize: Small,
    },
    [FiveByFive]: {
        columns: 5,
        rows: 5,
        maxScreenSize: Small,
    },
    [SixBySix]: {
        columns: 6,
        rows: 6,
        maxScreenSize: Small,
    },
    [SevenBySeven]: {
        columns: 7,
        rows: 7,
        maxScreenSize: MediumSmall,
    },
    [EightByEight]: {
        columns: 8,
        rows: 8,
        maxScreenSize: MediumLarge,
    },
    [NineByNine]: {
        columns: 9,
        rows: 9,
        maxScreenSize: Large,
    },
    [TenByTen]: {
        columns: 10,
        rows: 10,
        maxScreenSize: Large,
    },
}

export type { IBoardDimensions };
export { boards, Sizes, ScreenSizes  };
