import Fireworks from "./lib/components/Fireworks.svelte"

import "../node_modules/svelte-lib/src/lib/static/styles/root.css"
import "../node_modules/svelte-lib/src/lib/static/styles/app.css"

let div = document.createElement("div")
div.classList.add("fireworks")

let script = document.currentScript
script.parentNode.insertBefore(div, script)

new Fireworks({
  target: div,
})
