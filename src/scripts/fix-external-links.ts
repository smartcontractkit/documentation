document.addEventListener("astro:page-load", () => {
  const links = document.links
  for (let i = 0, linksLength = links.length; i < linksLength; i++) {
    if (!links[i].href.startsWith("javascript:") && ![window.location.hostname].includes(links[i].hostname)) {
      links[i].target = "_blank"
      links[i].relList.add("noopener")
    }
  }
})
