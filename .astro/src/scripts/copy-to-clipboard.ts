import ClipboardJS from "clipboard"

const clipboard = new ClipboardJS(".copy-iconbutton")

clipboard.on("success", function (e) {
  const oldLabel = e.trigger.innerHTML
  e.trigger.innerHTML = `<img src="/assets/icons/checkCircleIconGrey.svg" />`
  window.setTimeout(function () {
    e.trigger.innerHTML = oldLabel
  }, 2000)
  e.clearSelection()
})
