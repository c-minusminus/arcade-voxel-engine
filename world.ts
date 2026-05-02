enum WorldVars {
    //% block="sizeX"
    sizeX,
    //% block="sizeY"
    sizeY,
    //% block="sizeZ"
    sizeZ,
    //% block="X"
    X,
    //% block="XY"
    XY,
    //% block="XYZ"
    XYZ,
    //% block="voxels"
    voxels
}

namespace VoxelEngine.World {
    export let sizeX = 6
    export let sizeY = 6
    export let sizeZ = 6

    export let X = sizeX
    export let XY = X * sizeY
    export let XYZ = XY * sizeZ

    export let voxels: number[] = []

    export function init() {
        voxels = []

        for (let z = 0; z < sizeZ; z++) {
            for (let y = 0; y < sizeY; y++) {
                for (let x = 0; x < sizeX; x++) {
                    voxels[x + y * sizeX + z * XY] = (x+y+z)%2
                }
            }
        }
    }

    //% group="World"
    //% block="set world to %world"
    export function setWorld(world: number[]) {
        if (world.length == XYZ) voxels = world 
    }

    //% group="World"
    //% block="set voxel at x %x y %y z %z to %id"
    //% x.defl=0
    //% y.defl=0
    //% z.defl=0
    //% id.defl=0
    export function setVoxelXYZ(x: number, y: number, z: number, id: number) {
        if (x < 0 || y < 0 || z < 0) return
        if (x >= sizeX || y >= sizeY || z >= sizeZ) return
        voxels[x + y * sizeX + z * XY] = id
    }

    //% group="World"
    //% block="set voxel at %i to %id"
    //% i.defl=0
    //% id.defl=0
    export function setVoxel(i: number, id: number) {
        if (i < 0 || i >= XYZ) return
        voxels[i] = id
    }

    //% group="World"
    //% block="get voxel at x %x y %y z %z"
    //% x.defl=0
    //% y.defl=0
    //% z.defl=0
    export function getVoxelXYZ(x: number, y: number, z: number): number {
        if (x < 0 || y < 0 || z < 0) return 0
        if (x >= sizeX || y >= sizeY || z >= sizeZ) return 0
        return voxels[x + y * sizeX + z * XY]
    }

    //% group="World"
    //% block="get voxel at %i"
    //% i.defl=0
    export function getVoxel(i: number): number {
        if (i < 0 || i >= XYZ) return 0
        return voxels[i]
    }

    //% group="World"
    //% block="fill from x %x1 y %y1 z %z1 to x %x2 y %y2 z %z2 with %id"
    //% x0.defl=0
    //% y0.defl=0
    //% z0.defl=0
    //% x1.defl=0
    //% y1.defl=0
    //% z1.defl=0
    //% id.defl=0
    export function fillXYZ(
        x0: number, y0: number, z0: number,
        x1: number, y1: number, z1: number,
        id: number
    ) {
        // Normalize ranges
        const minX = Math.min(x0, x1)
        const maxX = Math.max(x0, x1)
        const minY = Math.min(y0, y1)
        const maxY = Math.max(y0, y1)
        const minZ = Math.min(z0, z1)
        const maxZ = Math.max(z0, z1)

        const base = minX + minY * X + minZ * XY

        const mX = maxX - minX + 1
        const mY = maxY - minY + 1
        const mZ = maxZ - minZ + 1

        for (let z = 0; z < mZ; z++) {
            const iZ = base + z * XY
            for (let y = 0; y < mY; y++) {
                const iY = iZ + y * X
                for (let x = 0; x < mX; x++) {
                    voxels[iY + x] = id
                }
            }
        }
    }

    //% group="World"
    //% block="fill world with %id"
    //% id.defl=0
    export function fillWorld(id: number) {
        for (let i = 0; i < XYZ; i++) voxels[i] = id
    }





    export function resizeX(amount: number) {
        if (amount == 0) return

        const oldX = sizeX
        const oldY = sizeY
        const oldZ = sizeZ

        const newX = oldX + amount
        if (newX <= 0) return

        // Update strides BEFORE modifying the array
        X = newX
        XY = newX * oldY
        XYZ = XY * oldZ
        sizeX = newX

        if (amount > 0) {
            // Grow
            for (let z = 0; z < oldZ; z++) {
                const iZ = z * XY
                for (let y = 0; y < oldY; y++) {
                    const iY = iZ + y * X
                    for (let x = oldX; x < newX; x++) {
                        voxels.insertAt(iY + x, 0)
                    }
                }
            }
        } else {
            // Shrink
            const removeCount = oldX - newX
            for (let z = 0; z < oldZ; z++) {
                const iZ = z * XY
                for (let y = 0; y < oldY; y++) {
                    let removeIndex = iZ + y * X + newX
                    for (let r = 0; r < removeCount; r++) {
                        voxels.removeAt(removeIndex)
                    }
                }
            }
        }
    }

    export function resizeY(amount: number) {
        if (amount === 0) return;
        const oldX = sizeX;
        const oldY = sizeY;
        const oldZ = sizeZ;
        const newY = oldY + amount;
        if (newY <= 0) return;

        if (amount > 0) {
            // GROW: Work backwards through slices so insertion doesn't mess up the next slice's math
            for (let z = oldZ - 1; z >= 0; z--) {
                // Find the end of the current Y-plane for this Z-slice
                const insertPos = (z + 1) * oldX * oldY;
                // Insert 'amount' rows of 'oldX' width
                for (let i = 0; i < amount * oldX; i++) {
                    voxels.insertAt(insertPos, 0);
                }
            }
        } else {
            // SHRINK: Work backwards through slices
            const rowsToRemove = -amount;
            for (let z = oldZ - 1; z >= 0; z--) {
                // Find the start of the rows to be deleted in this Z-slice
                const removePos = z * oldX * oldY + (newY * oldX);
                // Remove the voxels
                for (let i = 0; i < rowsToRemove * oldX; i++) {
                    voxels.removeAt(removePos);
                }
            }
        }

        // Update global dimensions AFTER the array is modified
        sizeY = newY;
        XY = sizeX * sizeY;
        XYZ = XY * sizeZ;
    }

    export function resizeZ(amount: number) {
        if (amount == 0) return

        const oldX = sizeX
        const oldY = sizeY
        const oldZ = sizeZ

        const oldXY = oldX * oldY
        const newZ = oldZ + amount
        if (newZ <= 0) return

        sizeZ = newZ

        if (amount > 0) {
            // GROW Z: append XY air voxels at the end
            for (let s = 0; s < amount; s++) {
                for (let i = 0; i < oldXY; i++) {
                    voxels.push(0)
                }
            }
        } else {
            // SHRINK Z: remove XY voxels from the end
            const slicesToRemove = -amount
            for (let s = 0; s < slicesToRemove; s++) {
                for (let i = 0; i < oldXY; i++) {
                    voxels.pop()
                }
            }
        }
    }

    //% group="World"
    //% block="get %v"
    export function getVar(v: WorldVars): any {
        switch(v) {
            case WorldVars.sizeX: return sizeX; break
            case WorldVars.sizeY: return sizeY; break
            case WorldVars.sizeZ: return sizeZ; break
            case WorldVars.X: return X; break
            case WorldVars.XY: return XY; break
            case WorldVars.XYZ: return XYZ; break
            case WorldVars.voxels: return voxels; break
        }
    }

    //% group="World"
    //% block="set %v to %amount"
    //% amount.defl=1
    export function changeVar(v: WorldVars, amount: any) {
        switch (v) {
            case WorldVars.sizeX: resizeX(amount); break
            case WorldVars.sizeY: resizeY(amount); break
            case WorldVars.sizeZ: resizeZ(amount); break
        }
    }

    //% group="World"
    //% block="change %v by %amount"
    //% value.defl=0
    export function setVar(v: WorldVars, value: any) {
        switch (v) {
            case WorldVars.sizeX: resizeX(sizeX - value); break
            case WorldVars.sizeY: resizeY(sizeY - value); break
            case WorldVars.sizeZ: resizeZ(sizeZ - value); break
        }
    }
}

namespace VoxelEngine.Textures {
    export let texData: Buffer[][] = [[hex``, hex``, hex``, hex``, hex``, hex``]]
    export let texW: Buffer = hex`00 00 00 00 00 00`
    export let texH: Buffer = hex`00 00 00 00 00 00`
    export let texDisp: Buffer = hex`00`

    //% group="Textures"
    //% block="add texture with faces %faces and display face %displayFace"
    export function addTexture(faces: Image[], displayFace: number) {
        function byteToBuffer(n: number): Buffer {
            let buf = Buffer.create(1)
            buf.setNumber(NumberFormat.Int8LE, 0, n)
            return buf
        }

        let arr: Buffer[] = []
        for (const face of faces) {
            texW = texW.concat(byteToBuffer(face.width))
            texH = texH.concat(byteToBuffer(face.height))

            let faceBuf = Buffer.create(face.width * face.height)
            face.getRows(0, faceBuf)
            arr.push(faceBuf)
        }
        texData.push(arr)

        texDisp = texDisp.concat(byteToBuffer(displayFace))
        VoxelEngine.Vars.blockCount = texData.length
    }

    //% group="Textures"
    //% block="add simple block %img"
    //% img.shadow=screen_image_picker
    export function addSimpleTexture(img: Image) {
        addTexture([img, img, img, img, img, img], 0)
    }

}

