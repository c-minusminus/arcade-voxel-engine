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
    blockBreaking,
    blockPlacing,
    hitboxDetection,
    render,
    updatePlayer,
    renderSelected,
    enabled,
}

namespace VoxelEngine {
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