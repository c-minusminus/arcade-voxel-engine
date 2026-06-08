namespace VoxelEngine.Features {
    export let blockBreaking = false
    export let blockPlacing = false
    export let hitboxDetection = false
    export let render = false
    export let updatePlayer = false
    export let renderSelected = false
    export let enabled = false
}

enum VoxelEngineEnable {
    //% block="block breaking"
    blockBreaking,
    //% block="block placing"
    blockPlacing,
    //% block="collide player with world"
    hitboxDetection,
    //% block="show world"
    render,
    //% block="update player"
    updatePlayer,
    //% block="render selected block"
    renderSelected,
    //% block="engine enabled"
    enabled,
}

namespace VoxelEngine {
    //% group="Engine"
    //% block="set feature %enable to %enabled"
    //% enabled.shadow="toggleOnOff"
    //% enabled.defl=true
    export function setFeature(enable: VoxelEngineEnable, enabled: boolean) {
        switch(enable) {
            case VoxelEngineEnable.blockBreaking:
                VoxelEngine.Features.blockBreaking = enabled
                break;
            case VoxelEngineEnable.blockPlacing:
                VoxelEngine.Features.blockPlacing = enabled
                break;
            case VoxelEngineEnable.hitboxDetection:
                VoxelEngine.Features.hitboxDetection = enabled
                break;
            case VoxelEngineEnable.render:
                VoxelEngine.Features.render = enabled
                break;
            case VoxelEngineEnable.updatePlayer:
                VoxelEngine.Features.updatePlayer = enabled
                break;
            case VoxelEngineEnable.renderSelected:
                VoxelEngine.Features.renderSelected = enabled
                break;
            case VoxelEngineEnable.enabled:
                VoxelEngine.Features.enabled = enabled
                break;
        }
    }
}