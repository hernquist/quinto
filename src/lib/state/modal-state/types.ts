enum ModalScreen {
    Settings = "settings",
    About = "about",
    GameOver = "gameOver",
    HighScores = "highScores"
}

interface IModalState {
	name: ModalScreen, 
}

export { ModalScreen };
export type { IModalState };