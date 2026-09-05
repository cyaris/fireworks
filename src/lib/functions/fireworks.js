import { easeCircle, easeQuad } from "d3-ease"
import { randomNormal } from "d3-random"
import {
  configureCanvas2D,
  createAnimationLoop,
  createPausableTimer,
  getEasedProgress
} from "svelte-lib/functions/canvas"
import { interpolateOklch } from "svelte-lib/functions/color"
import { lerp } from "svelte-lib/functions/math"

import palettes from "../static/palettes.js"

// tail particles (index <= fireworkTailSize) launch staggered by tailDelaySize ms each, then
// all catch up and become fully opaque together once the slowest tail particle would have.
let launchRadius = 3
let launchDuration = 1000
let fireworkTailSize = 90
let tailDelaySize = 2.5

let explosionRadius = 5
let finalRadius = 10

let canvasStates = new WeakMap()

function createBurst({ height, width }) {
  // defining y parameter for the height of the launch
  // the lowest possible launch height.
  let launchYMin = height * 0.1
  // this is the distance from the top of the page
  let launchYLoc = launchYMin * Math.random() + launchYMin

  // defining adjusted y parameter for delay preceding explosion
  // new height adjusting for the distance by which the rocket will descend after reaching its peak (prior to exploding)
  let explosionDrop = Math.random() * 90 + 20
  // height all the circles will be at after the drop (and just before exploding)
  let explosionYLoc = launchYLoc + explosionDrop

  // x coordinate for the ascending (and descending) rocket
  let launchXLoc = randomNormal(width / 2, width / 8)()

  // determining the magnitude of the explosion (value to be squared) at random
  // the actual distance from the explosion will be a combination of this value and another random value determined for each piece
  // this will also be used to decide the total circles for the explosion
  let explosionMagnitude = Math.random() * 40 + 140
  // total circles for the explosion, and the x/y coordinates for each piece
  let particles = Array.from({ length: Math.round(explosionMagnitude * 1.5) }, (_, i) => {
    // distance from the center of the explosion determined at random
    // explosionMagnitude stays the same for each circle
    let explosionDistance = Math.sqrt(~~(Math.random() * explosionMagnitude * explosionMagnitude))
    // randomly determining the angle by which each circle will be relative to the center of the explosion
    let randomAngle = Math.random() * 2 * Math.PI

    return {
      i,
      targetX: launchXLoc + explosionDistance * Math.cos(randomAngle),
      targetY: explosionYLoc + explosionDistance * Math.sin(randomAngle)
    }
  })

  let randomPalette = palettes[Math.floor(Math.random() * palettes.length)]

  let launchSpeed = launchDuration / (height + launchRadius - launchYLoc)
  let dropDuration = launchSpeed * explosionDrop
  let burstDuration = Math.random() * 100 + 500
  let fadeDuration = Math.random() * 1500 + 1000
  let explodeTime = launchDuration + dropDuration + fireworkTailSize * tailDelaySize

  return {
    start: performance.now(),
    groundY: height + launchRadius,
    launchXLoc,
    launchYLoc,
    explosionYLoc,
    dropDuration,
    explodeTime,
    burstDuration,
    fadeDuration,
    totalDuration: explodeTime + burstDuration + fadeDuration,
    particles: particles.map((particle, index) => {
      // the burst fill is the particle's own initial color; only the fade-out color advances the palette
      let initialFill = randomPalette[particle.i % randomPalette.length]

      return {
        ...particle,
        delay: particle.i <= fireworkTailSize ? particle.i * tailDelaySize : 0,
        initialOpacity: particle.i > 0 && particle.i <= fireworkTailSize ? 0.15 : 1,
        initialFill,
        finalX: 2 * particle.targetX - launchXLoc,
        finalY: 2 * particle.targetY - explosionYLoc,
        fadeColorScale: interpolateOklch(initialFill, randomPalette[(particles.length + index) % randomPalette.length])
      }
    })
  }
}

function getParticleDraw(burst, particle, elapsed) {
  let ascentStart = particle.delay
  let dropStart = ascentStart + launchDuration
  let waitStart = dropStart + burst.dropDuration
  let burstStart = burst.explodeTime
  let fadeStart = burstStart + burst.burstDuration

  if (elapsed < ascentStart) {
    return {
      fill: particle.initialFill,
      opacity: particle.initialOpacity,
      radius: launchRadius,
      x: burst.launchXLoc,
      y: burst.groundY
    }
  }

  if (elapsed < dropStart) {
    let progress = getEasedProgress({ duration: launchDuration, ease: easeCircle, now: elapsed, start: ascentStart })

    return {
      fill: particle.initialFill,
      opacity: particle.initialOpacity,
      radius: launchRadius,
      x: burst.launchXLoc,
      y: lerp(burst.groundY, burst.launchYLoc, progress)
    }
  }

  if (elapsed < waitStart) {
    let progress = getEasedProgress({ duration: burst.dropDuration, ease: easeQuad, now: elapsed, start: dropStart })

    return {
      fill: particle.initialFill,
      opacity: particle.initialOpacity,
      radius: lerp(launchRadius, explosionRadius, progress),
      x: burst.launchXLoc,
      y: lerp(burst.launchYLoc, burst.explosionYLoc, progress)
    }
  }

  if (elapsed < burstStart) {
    return {
      fill: particle.initialFill,
      opacity: particle.initialOpacity,
      radius: explosionRadius,
      x: burst.launchXLoc,
      y: burst.explosionYLoc
    }
  }

  if (elapsed < fadeStart) {
    let progress = getEasedProgress({
      duration: burst.burstDuration,
      ease: easeCircle,
      now: elapsed,
      start: burstStart
    })

    return {
      fill: particle.initialFill,
      opacity: 1,
      radius: lerp(explosionRadius, finalRadius, progress),
      x: lerp(burst.launchXLoc, particle.targetX, progress),
      y: lerp(burst.explosionYLoc, particle.targetY, progress)
    }
  }

  // any later phase is unreachable: renderFrame prunes a burst once elapsed reaches totalDuration.
  let progress = getEasedProgress({ duration: burst.fadeDuration, ease: easeCircle, now: elapsed, start: fadeStart })

  return {
    fill: particle.fadeColorScale(progress),
    opacity: 1 - progress,
    radius: finalRadius,
    x: lerp(particle.targetX, particle.finalX, progress),
    y: lerp(particle.targetY, particle.finalY, progress)
  }
}

function getFireworkScene(activeBursts, fireworkScene, now) {
  fireworkScene.length = 0
  activeBursts.forEach(burst => {
    let elapsed = now - burst.start

    burst.particles.forEach(particle => {
      let draw = getParticleDraw(burst, particle, elapsed)
      if (draw.opacity > 0) fireworkScene.push(draw)
    })
  })

  return fireworkScene
}

function drawFireworkScene(context, scene) {
  context.save()
  scene.forEach(({ fill, opacity, radius, x, y }) => {
    context.globalAlpha = opacity
    context.fillStyle = fill
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
  })
  context.restore()
}

function renderFrame(canvas, state, now) {
  state.activeBursts = state.activeBursts.filter(burst => now - burst.start < burst.totalDuration)

  if (!canvas || canvas.isConnected === false) {
    state.activeBursts = []
    return false
  }
  if (!state.activeBursts.length) return false

  let height = canvas.clientHeight
  let width = canvas.clientWidth

  let { context } = configureCanvas2D({ canvas, height, width })
  if (!context) return true

  context.clearRect(0, 0, width, height)
  drawFireworkScene(context, getFireworkScene(state.activeBursts, state.fireworkScene, now))

  return true
}

function getCanvasState(canvas) {
  let state = canvasStates.get(canvas)
  if (!state) {
    state = { activeBursts: [], fireworkScene: [] }
    state.animationLoop = createAnimationLoop(now => renderFrame(canvas, state, now))
    canvasStates.set(canvas, state)
  }

  return state
}

function getDefaultCanvas() {
  return globalThis.document?.getElementById("fireworks")
}

export function launchFireworkBurst(canvas = getDefaultCanvas()) {
  let width = canvas && canvas.clientWidth
  let height = canvas && canvas.clientHeight

  if (width && height) {
    let state = getCanvasState(canvas)
    state.activeBursts.push(createBurst({ height, width }))
    state.animationLoop.start()
  }
}

export function getFireworkShowDelays(
  totalFireworksMain,
  totalFireworksFinale,
  randomIntervalMsInput,
  random = Math.random
) {
  let fireworkIntervalMain = 1540
  let fireworkIntervalFinale = 500
  let regularShowMinDuration = fireworkIntervalMain * (totalFireworksMain - 1)
  let previousFinaleDelay = 0
  let delays = []

  for (let i = 0; i < totalFireworksMain + totalFireworksFinale; i++) {
    let randomInterval = i == 0 ? 0.5 : random() * 2 * randomIntervalMsInput - randomIntervalMsInput
    let delay

    if (i < totalFireworksMain) {
      delay = Math.max(0, fireworkIntervalMain * i + randomInterval)
    } else {
      delay = Math.max(
        0,
        previousFinaleDelay,
        regularShowMinDuration + fireworkIntervalFinale * (i - (totalFireworksMain - 1)) + randomInterval
      )
      previousFinaleDelay = delay
    }

    delays.push(delay)
  }

  return delays
}

export function launchFireworkShow(totalFireworksMain, totalFireworksFinale, randomIntervalMsInput, canvas) {
  let timers = getFireworkShowDelays(totalFireworksMain, totalFireworksFinale, randomIntervalMsInput).map(delay =>
    createPausableTimer(() => launchFireworkBurst(canvas), delay)
  )

  return () => timers.forEach(timer => timer.stop())
}

export { getParticleDraw }
