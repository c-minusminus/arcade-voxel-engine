const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{};:,.?"
const BASE = chars.length; // 85

namespace VoxelEngine.Vars {
    export let blockCount: number
    export let selectedBlock: number = 0
    export let sxTable: number[] = []
    export let syTable: number[] = []
    export let charToIndex: number[] = []

    export let prevLeft: boolean = false
    export let prevRight: boolean = false
    export let prevZ: boolean = false
    export let prevX: boolean = false
    export let prevG: boolean = false


    export let renderX: number[]

    function hexToNum(c: string): number {
        const code = c.charCodeAt(0);

        // '0'–'9'
        if (code <= 57) return code - 48;

        // 'A'–'F'
        if (code <= 70) return code - 55;

        // 'a'–'f'
        return code - 87;
    }
    
    export function init() {
        blockCount = VoxelEngine.Textures.textures.length


        for (let i = 0; i < chars.length; ++i) {
            charToIndex[chars.charCodeAt(i)] = i
        }

        for (let t = 0; t < VoxelEngine.Textures.textures.length; ++t) {
            VoxelEngine.Textures.texData[t] = []
            for (let f = 5; f >= 0; --f) {
                const row = VoxelEngine.Textures.textures[t][f]
                VoxelEngine.Textures.texData[t][5 - f] = []   // keep output in normal order
                const len = row.length - 2
                for (let i = 0; i < len; i++) {
                    VoxelEngine.Textures.texData[t][5 - f][i] = hexToNum(row[row.length - 1 - i])
                }

            }

        }

        for (let v = 0; v < VoxelEngine.Textures.textures.length; ++v) {
            for (let f = 0; f < 6; ++f) {
                const row = VoxelEngine.Textures.textures[v][f]
                const w = charToIndex[row.charCodeAt(0)]
                const h = charToIndex[row.charCodeAt(1)]
                VoxelEngine.Textures.texW.push(w)
                VoxelEngine.Textures.texH.push(h)
            }
            const row = VoxelEngine.Textures.textures[v][6]
            const char = row.charCodeAt(0) // TypeError: Expected type string but received type undefined. Did you forget to assign a variable?
            const disp = charToIndex[char]
            VoxelEngine.Textures.texDisp.push(disp)
        }



        //for (let z = 0; z < VoxelEngine.World.sizeZ; ++z)
        //    for (let y = 0; y < VoxelEngine.World.sizeY; ++y)
        //        for (let x = 0; x < VoxelEngine.World.sizeX; ++x)
        //            VoxelEngine.World.voxels[x + y * VoxelEngine.World.sizeX + z * VoxelEngine.World.XY] = charToIndex[VoxelEngine.World.slices[z][y].charCodeAt(x)]

        for (let x = 0; x < scene.screenWidth(); x++) {
            sxTable[x] = (x / scene.screenWidth()) * 2 - 1
        }
        for (let y = 0; y < scene.screenHeight(); y++) {
            syTable[scene.screenHeight() - y - 1] = (y / scene.screenHeight()) * 2 - 1
        }
    }
}