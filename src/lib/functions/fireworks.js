import * as d3 from "d3"

import { palettes } from "../palettes.js"

// credit is due to this blocks page for the process defined below: http://bl.ocks.org/s2t2/53e96654487b4b0ef6e5
// I took what was there, made adjustments on preference/version differences, and added to it.
export function launchFireworkBurst() {
  let width = d3.select("#fireworks").node().clientWidth
  let height = d3.select("#fireworks").node().clientHeight
  // defining y parameter for the height of the launch
  // the lowest possible launch height.
  let launchYMin = height * 0.1
  // the is the distance from the top of the pange
  let launchYLoc = launchYMin * Math.random() + launchYMin
  // defining adjusted y parameter for delay preceding explosion
  // new height adjusting for the distance by which the rocket will descend after reaching its peak (prior to exploding)
  let explosionDrop = Math.random() * 90 + 20
  // height all the circles will be at after the drop (and just before exploding)
  let explosionYLoc = launchYLoc + explosionDrop
  // function below will be used to determine the x location for launching the rocket
  let getLaunchXLoc = d3.randomNormal(width / 2, width / 8)
  // defining values for the launch of the firework
  // x coordinate for the ascending (and descending) rocket
  let launchXLoc = getLaunchXLoc()
  // determining the magnitude of the explosion (value to be squared) at random
  // the actual distance from the explosion will be a combination of this value and another random value determined for each piece
  // this will also be used to decide the total circles for the explosion
  let explosionMagnitude = Math.random() * 40 + 140
  // total circles for the explosion
  let totalCircles = Math.round(explosionMagnitude * 1.5)
  // function to determine the x coordinates for all explosion pieces
  let explosionData = d3.range(totalCircles).map(() => {
    // distance fron the center of the explosion determined at random
    // explosionSize (magnitude of the explosion) stays the same for each circle
    let explosionDistance = Math.sqrt(~~(Math.random() * explosionMagnitude * explosionMagnitude))
    // randomly determining the angle by which each circle will be relative to the center of the explosion
    let randomAngle = Math.random() * 2 * Math.PI

    return {
      id: crypto.randomUUID(),
      x: launchXLoc + explosionDistance * Math.cos(randomAngle),
      y: explosionYLoc + explosionDistance * Math.sin(randomAngle),
    }
  })

  let randomPalette = palettes[Math.floor(Math.random() * palettes.length)]

  let fireWorkPaletteFunc = d3
    .scaleOrdinal()
    .domain([Math.min(explosionData.x), Math.max(explosionData.x)])
    .range(randomPalette)

  let launchRadius = 3
  let launchDuration = 1000
  let launchSpeed = launchDuration / (height + launchRadius - launchYLoc)
  // these two variables will help create the tail effect with delay
  let fireWorkTailSize = 90
  let tailDelaySize = 2.5

  d3.select("#fireworks")
    .selectAll()
    .data(explosionData)
    .enter()
    .append("circle")
    .attr("id", d => d.id)
    .attr("r", launchRadius)
    .attr("cx", launchXLoc)
    .attr("cy", height + launchRadius)
    .style("fill", randomPalette[Math.floor(Math.random() * randomPalette.length)])
    .style("opacity", (d, i) => (i > 0 && i <= fireWorkTailSize ? 0.15 : 1))
    .transition()
    // delay here is to create the ascending tail.
    .delay((d, i) => (i <= fireWorkTailSize ? i * tailDelaySize : 0))
    .ease(d3.easeCircle)
    .duration(launchDuration)
    .attr("cy", launchYLoc)
    .transition()
    .duration(launchSpeed * explosionDrop)
    .ease(d3.easeQuad)
    .attr("r", 5)
    .attr("cy", explosionYLoc)
    .transition()
    // delay here is to allow all objects to catch up.
    .delay((d, i) =>
      i > 0 && i <= fireWorkTailSize
        ? fireWorkTailSize * tailDelaySize - i * tailDelaySize
        : fireWorkTailSize * tailDelaySize
    )
    .duration(0)
    .style("opacity", 1)
    .transition()
    .duration(500)
    .ease(d3.easeCircle)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", 10)
    // .attr('r', function(d) { return chance.floating({ min: 0.5, max: 15 }); })
    .style("fill", d => fireWorkPaletteFunc(d.x))
    .transition()
    .duration(Math.random() * 1500 + 1000)
    .ease(d3.easeCircle)
    .style("opacity", 0)
    .attr("cx", d => (d.x > launchXLoc ? d.x + (d.x - launchXLoc) : d.x - (-d.x + launchXLoc)))
    .attr("cy", d => (d.y > explosionYLoc ? d.y + (d.y - explosionYLoc) : d.y - (-d.y + explosionYLoc)))
    .on("end", d => document.getElementById(d.id).remove())
}

export function launchFireworkShow(totalFireworksMain, totalFireworksFinale, randomIntervalMsInput) {
  // totalFireworksMain: total fireworks in the regular show
  // totalFireworksFinale: total fireworks in the grand finale
  // duration per firework of the regular show
  let fireworkIntervalMain = 1500
  // totalFireworksFinale: total fireworks in the grand finale
  // duration per firework of the grand finale show
  let fireWorkIntervalFinale = 500

  for (var i = 0; i <= totalFireworksMain + totalFireworksFinale - 1; i++) {
    // setting random variable manually for first iteration only.
    let randomInterval = i == 0 ? 0.5 : Math.random() * 2 * randomIntervalMsInput - randomIntervalMsInput
    // subtracting one from totalFireworksMain so that the first firework comes without any delay.
    let regularShowMinDuration = fireworkIntervalMain * (totalFireworksMain - 1)
    // all fireworks for the regular show
    d3.timeout(
      launchFireworkBurst,
      i <= totalFireworksMain
        ? Math.max(0, fireworkIntervalMain * i + randomInterval)
        : Math.max(
            regularShowMinDuration - randomIntervalMsInput,
            regularShowMinDuration + fireWorkIntervalFinale * (i - (totalFireworksMain - 1)) + randomInterval
          )
    )
  }
}
