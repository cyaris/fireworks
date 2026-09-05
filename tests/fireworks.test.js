import assert from "node:assert/strict"
import test from "node:test"

import { getFireworkShowDelays, getParticleDraw, launchFireworkBurst } from "../src/lib/functions/fireworks.js"

function createContext() {
  return {
    arc() {},
    beginPath() {},
    clearRectCalls: 0,
    clearRect() {
      this.clearRectCalls += 1
    },
    fill() {},
    restore() {},
    save() {},
    setTransform() {}
  }
}

function createCanvas() {
  let context = createContext()
  return {
    clientHeight: 600,
    clientWidth: 800,
    context,
    getContext: () => context,
    height: 0,
    isConnected: true,
    width: 0
  }
}

test("getFireworkShowDelays starts the finale after every main firework", () => {
  assert.deepEqual(
    getFireworkShowDelays(3, 2, 1000, () => 0.5),
    [0.5, 1540, 3080, 3580, 4080]
  )
})

test("getFireworkShowDelays keeps randomized finale launches in chronological order", () => {
  let randomValues = [0.5, 0.5, 1, 0]
  let delays = getFireworkShowDelays(2, 3, 1000, () => randomValues.shift())

  assert.equal(delays.length, 5)
  assert.ok(delays.slice(2).every((delay, i, finale) => i == 0 || delay >= finale[i - 1]))
})

test("getParticleDraw follows launch, explosion, and fade geometry", () => {
  let burst = {
    burstDuration: 100,
    dropDuration: 100,
    explodeTime: 1120,
    explosionYLoc: 30,
    fadeDuration: 100,
    groundY: 100,
    launchXLoc: 50,
    launchYLoc: 20,
    totalDuration: 1320
  }
  let particle = {
    delay: 20,
    fadeColorScale: progress => `fade:${progress}`,
    finalX: 90,
    finalY: 70,
    initialFill: "red",
    initialOpacity: 0.15,
    targetX: 70,
    targetY: 50
  }

  assert.deepEqual(getParticleDraw(burst, particle, 0), { fill: "red", opacity: 0.15, radius: 3, x: 50, y: 100 })
  assert.deepEqual(getParticleDraw(burst, particle, 1120), { fill: "red", opacity: 1, radius: 5, x: 50, y: 30 })
  assert.deepEqual(getParticleDraw(burst, particle, 1320), { fill: "fade:1", opacity: 0, radius: 10, x: 90, y: 70 })
})

test("launchFireworkBurst keeps concurrent canvases on separate animation frames", () => {
  let originalCancelAnimationFrame = globalThis.cancelAnimationFrame
  let originalRequestAnimationFrame = globalThis.requestAnimationFrame
  let frames = []
  globalThis.cancelAnimationFrame = () => {}
  globalThis.requestAnimationFrame = callback => {
    frames.push(callback)
    return frames.length
  }

  try {
    let navbarCanvas = createCanvas()
    let embeddedCanvas = createCanvas()
    launchFireworkBurst(navbarCanvas)
    launchFireworkBurst(embeddedCanvas)

    assert.equal(frames.length, 2)
    frames[0](performance.now())
    assert.equal(navbarCanvas.context.clearRectCalls, 1)
    assert.equal(embeddedCanvas.context.clearRectCalls, 0)

    frames[1](performance.now())
    assert.equal(navbarCanvas.context.clearRectCalls, 1)
    assert.equal(embeddedCanvas.context.clearRectCalls, 1)
  } finally {
    globalThis.cancelAnimationFrame = originalCancelAnimationFrame
    globalThis.requestAnimationFrame = originalRequestAnimationFrame
  }
})
