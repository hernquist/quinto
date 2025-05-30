import { Axis, Direction, type IKeyMap } from "./types";

export const independentKeyMap: IKeyMap = {
    [Direction.Horizontal]: Axis.X,
    [Direction.Vertical]: Axis.Y,
}

export const dependentKeyMap: IKeyMap = {
    [Direction.Horizontal]: Axis.Y,
    [Direction.Vertical]: Axis.X,
}