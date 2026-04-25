const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{};:,.?"
const BASE = chars.length; // 85

namespace VoxelEngine.Vars {
    export let blockCount: number
    export let selectedBlock: number = 1
    export let sxTable: number[] = []
    export let syTable: number[] = []

    export let prevLeft: boolean = false
    export let prevRight: boolean = false
    export let prevZ: boolean = false
    export let prevX: boolean = false
    export let prevG: boolean = false

    export function init() {
        for (let x = 0; x < scene.screenWidth(); x++) {
            sxTable[x] = (x / scene.screenWidth()) * 2 - 1
        }
        for (let y = 0; y < scene.screenHeight(); y++) {
            syTable[scene.screenHeight() - y - 1] = (y / scene.screenHeight()) * 2 - 1
        }
    }
}