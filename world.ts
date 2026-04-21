/*namespace VoxelEngine.World {
    export let sizeX = 16
    export let sizeY = 16
    export let sizeZ = 16

    export const X = sizeX
    export const XY = X * sizeY
    export const XYZ = XY * sizeZ

    export let voxels: number[] = []

    export function init() { }

    export function setBlock(x: number, y: number, z: number, id: number) {
        if (x < 0 || y < 0 || z < 0) return
        if (x >= sizeX || y >= sizeY || z >= sizeZ) return
        voxels[x + y * sizeX + z * sizeX * sizeY] = id
    }

    export function getBlock(x: number, y: number, z: number): number {
        if (x < 0 || y < 0 || z < 0) return 0
        if (x >= sizeX || y >= sizeY || z >= sizeZ) return 0
        return voxels[x + y * sizeX + z * sizeX * sizeY]
    }
}

namespace VoxelEngine.Textures {
    export const textures: string[][] = []
    export const texData: number[][][] = []
    export const texW: number[] = []
    export const texH: number[] = []
    export const texDisp: number[] = []

    //export function decodeAll() { }

    export function addTexture(faces: string[]) { }
}
*/

namespace VoxelEngine.World {

    export let sizeX = 6
    export let sizeY = 6
    export let sizeZ = 6

    export const X = sizeX
    export const XY = X * sizeY
    export const XYZ = XY * sizeZ

    export let voxels: number[] = []

    export function init() {
        voxels = []

        for (let z = 0; z < sizeZ; z++) {
            for (let y = 0; y < sizeY; y++) {
                for (let x = 0; x < sizeX; x++) {
                    voxels[x + y * sizeX + z * XY] = Math.clamp(0,1, (x+y+z)%6-1)
                }
            }
        }
    }

    export function setBlock(x: number, y: number, z: number, id: number) {
        if (x < 0 || y < 0 || z < 0) return
        if (x >= sizeX || y >= sizeY || z >= sizeZ) return
        voxels[x + y * sizeX + z * XY] = id
    }

    export function getBlock(x: number, y: number, z: number): number {
        if (x < 0 || y < 0 || z < 0) return 0
        if (x >= sizeX || y >= sizeY || z >= sizeZ) return 0
        return voxels[x + y * sizeX + z * XY]
    }
}
let a = "ccbcbcbcbcb"
namespace VoxelEngine.Textures {

    export const textures: string[][] = [
        ["", "", "", "", "", "", "a"],
        [a, a, a, a, a, a, "a"]
    ]

    export const texData: number[][][] = []
    export const texW: number[] = []
    export const texH: number[] = []
    export const texDisp: number[] = []

    export function decodeAll() {
        // Decode textures into texData, texW, texH
        for (let v = 0; v < textures.length; ++v) {
            for (let f = 0; f < 6; ++f) {
                const row = textures[v][f]
                const w = VoxelEngine.Vars.charToIndex[row.charCodeAt(0)]
                const h = VoxelEngine.Vars.charToIndex[row.charCodeAt(1)]
                texW.push(w)
                texH.push(h)
            }
            const row = textures[v][6]
            const char = row.charCodeAt(0)
            const disp = VoxelEngine.Vars.charToIndex[char]
            texDisp.push(disp)
        }
    }
}