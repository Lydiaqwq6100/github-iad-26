(function () {
  const config = window.SANITY_CONFIG

  if (!config?.projectId || config.projectId === 'YOUR_PROJECT_ID') {
    console.warn(
      '[CMS] Set your Sanity project ID in js/config.js before content will load from the CMS.'
    )
  }

  async function fetchSanity(query, params = {}) {
    const {projectId, dataset, apiVersion} = config
    const url = new URL(
      `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`
    )
    url.searchParams.set('query', query)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(`$${key}`, JSON.stringify(value))
    })

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Sanity query failed: ${response.status}`)
    }

    const json = await response.json()
    return json.result
  }

  function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text ?? ''
    return div.innerHTML
  }

  function renderPortableText(blocks) {
    if (!blocks?.length) return ''

    return blocks
      .map((block) => {
        if (block._type !== 'block' || !block.children?.length) return ''

        const inner = block.children
          .map((child) => {
            let text = escapeHtml(child.text)
            if (child.marks?.includes('em')) {
              text = `<em>${text}</em>`
            }
            if (child.marks?.includes('strong')) {
              text = `<strong>${text}</strong>`
            }
            return text
          })
          .join('')

        if (block.style === 'h2') return `<h2 class="text-2xl font-gothic mb-4">${inner}</h2>`
        if (block.style === 'h3') return `<h3 class="text-xl font-gothic mb-3">${inner}</h3>`
        return `<p>${inner}</p>`
      })
      .join('')
  }

  function getGalleryLink(item) {
    return item.linkUrl || item.fileUrl || item.imageUrl || '#'
  }

  window.SanityCMS = {
    fetchSanity,
    escapeHtml,
    renderPortableText,
    getGalleryLink,
    isConfigured() {
      return Boolean(config?.projectId && config.projectId !== 'YOUR_PROJECT_ID')
    },
  }
})()
